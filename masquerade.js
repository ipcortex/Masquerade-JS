/*
*  Masquerade JS
*  
*  IP Cortex Ltd
*
*  Author: Matthew Preskett
*  Co-Author: Steve Davies
*
*  https://github.com/ipcortex/Masquerade-JS
*/

(function() {
	Class = function(definition) { 
		var Construct = function Class() {
			var object = Object.create(Inner);
			for ( var property in definition ) {
				if ( property === 'construct' )
					continue;
				if ( property.substr(0, 1) === '_' || property.substr(0, 1) === '$' )
					continue;
				if ( typeof(definition[property]) === 'object' ) {
					if ( property === 'defineProperties' ) {
						var properties = {};
						for ( var define in definition[property] ) {
							properties[define] = properties[define] || {};
							for ( var operator in definition[property][define] ) {
								if ( operator === 'get' || operator === 'set' )
									properties[define][operator] = object['_property_' + define + '_' + operator].bind(object);
								else
									properties[define][operator] = definition[property][define][operator];
							}
						}
						Object.defineProperties(this, properties);
					} else
						this[property] = definition[property];
				} else if ( typeof(object[property]) === 'function' )
					Object.defineProperty(this, property, {
						value: object[property].bind(object),
						enumerable: false,
						writable: false
					});
			}
			if ( typeof(definition.construct) === 'function' ) {
				object.$public = this;
				definition.construct.apply(object, arguments);
				delete object.$public;
			}
		};

		Construct.extend = function(extension) {
			for ( var property in definition ) {
				if ( property === 'defineProperties' )
					continue;
				if ( definition.hasOwnProperty(property) && ! extension.hasOwnProperty(property))
					extension[property] = definition[property];
			}
			return new Class(extension);
		};

		/* Construct Inner from Construct so 'instanceof' works */
		var Inner = Object.create(Construct.prototype);
		var sharedStorage = {};
		for ( var property in definition ) {
			if ( ! definition.hasOwnProperty(property) )
				continue;
			if ( property.substr(0, 1) === '$' )
				Construct[property.substr(1)] = definition[property];
			else if ( property === 'defineProperties' ) {
				for ( var define in definition[property] ) {
					for ( var operator in definition[property][define] )
						Inner['_property_' + define + '_' + operator] = definition[property][define][operator];
				}
			} else if ( typeof(definition[property]) !== 'function' ) {
				sharedStorage[property] = {value: definition[property]};
				var getNset = {
					get:	function() { return this.value; }.bind(sharedStorage[property]),
					set:	function(v) { this.value = v; }.bind(sharedStorage[property])
				};
				if ( property.substr(0, 1) !== '_' ) {
					Object.defineProperty(Construct.prototype, property, getNset);
					Object.defineProperty(Construct, property, getNset);
				} else
					Object.defineProperty(Inner, property, getNset);
			} else	/* type == 'function' */
				Inner[property] = definition[property];
		}

		Construct._isClass = true;
		return Construct;
	};

	Class._isClass = true;
})();
