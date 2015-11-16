/*
*  Masquerade JS
*
*  Author: Matthew Preskett
*  Co-Author: Steve Davies
*/

(function() {
	Class = function(definition) { 
		var Inner = null;

		var Construct = function Class() {
			var object = Object.create(Inner);
			for ( var property in definition ) {
				if ( property == 'construct' )
					continue;
				if ( property.substr(0, 1) == '_' || property.substr(0, 1) == '$' )
					continue;
				if ( typeof(definition[property]) == 'object' ) {
					if ( property == 'defineProperties' ) {
						var properties = {};
						for ( var define in definition[property] ) {
							properties[define] = properties[define] || {};
							for ( var operator in definition[property][define] )
								properties[define][operator] = object['_property_' + define + '_' + operator].bind(object);
						}
						Object.defineProperties(this, properties);
					} else
						this[property] = definition[property];
				} else if ( typeof(object[property]) == 'function' )
					this[property] = object[property].bind(object);
			}
			if ( typeof(definition.construct) == 'function' ) {
				object.$public = this;
				definition.construct.apply(object, arguments);
				delete object.$public;
			}
		};

		Construct.extend = function(extension) {
			for ( var property in definition ) {
				if ( property == 'defineProperties' )
					continue;
				if ( definition.hasOwnProperty(property) && ! extension.hasOwnProperty(property))
					extension[property] = definition[property];
			}
			return new Class(extension);
		};

		Inner = Object.create(Construct.prototype);

		for ( var property in definition ) {
			if ( ! definition.hasOwnProperty(property) )
				continue;
			if ( property.substr(0, 1) == '$' ) {
				Construct[property.substr(1)] = definition[property];
				continue;
			}
			if ( property == 'defineProperties' ) {
				for ( var define in definition[property] ) {
					for ( var operator in definition[property][define] )
						Inner['_property_' + define + '_' + operator] = definition[property][define][operator];
				}
				continue;
			} 
			if ( typeof(definition[property]) == 'object' && property.substr(0, 1) != '_' )
				Construct[property] = definition[property];
			Inner[property] = definition[property];
		}

		Construct._isClass = true;

		return Construct;
	};

	Class._isClass = true;
})();
