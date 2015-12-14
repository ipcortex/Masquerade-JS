# Masquerade JS

Part of our (corporate) product is a Javascript API, we often hand copies of our (class) objects around and only want specific attributes exposed. Masquerade JS is a wrapper that attempts to correctly scope class methods and storage in OO Javascript. It allows you to expose only what you want to expose. There is a small caveat, if you pass references to the private **this** you will expose the entire object. If you want to stay protected only pass a reference to the public object provided to you on creation. The public object is briefly made available within the constructor on **this.$public**, be careful of circular references if you use it.

This adds class functionality to ES5, similar but not identical to ES6. However it adds private scoping to fields and methods which is not available in ES5 or ES6.

## Class definition

    var Example = new Class({
        construct:
            function() {
                this.count = 0;
                this.string = 'example string';
            }
    });

## New object

    var example = new Example();

# Methods

## Class public method

**getString** will be publicly callable.

    var Example = new Class({
        construct:
            function() {
                this.count = 0;
                this.string = 'example string';
            },
        getString:
            function() {
                return this.string;
            }
    });

    var example = new Example();

    example.getString(); /* returns 'example string' */

## Class private method

**_incrementCount** is only callable from the **this** context.

    var Example = new Class({
        construct:
            function() {
                this.count = 0;
                this.string = 'example string';
            },
        getString:
            function() {
                this._incrementCount();
                return this.string;
            },
        _incrementCount:
            function() {
                this.count++;
            }
    });

    var example = new Example();

    example._incrementCount(); /* undefined */

    example.getString() /* returns 'example string' and increments this.count */

## Class static method

**getDate** is copied by reference to the class definition.

    var Example = new Class({
        construct:
            function() {
                this.count = 0;
                this.string = 'example string';
            },
        $getDate:
            function() {
                return (new Date()).getTime();
            }
    });

    Example.getDate(); /* returns epoch */

## Class extension

**Extend** will inherit all methods from **Example**.

    var Extend = Example.extend({
        construct:
            function() {
                this.count = 0;
                this.string = 'extend string';
            }
    });

    var extend = new Extend();

    extend.getString() /* returns 'extend string' and increments this.count */

## Method extension

**getStringCount** will only be available on instances of **Extend**.

    var Extend = Example.extend({
        construct:
            function() {
                this.count = 0;
                this.string = 'extend string';
            },
        getStringCount:
            function() {
                return this.string + ' ' + this.count;
            }
    });

    var example = new Example();

    example.getStringCount(); /* undefined */

    var extend = new Extend();

    extend.getStringCount(); /* returns 'extend string *this.count' */

# Storage

## Private storage

Anything stored on **this** will be private to an instance.

    var Example = new Class({
        construct:
            function() {
                this.count = 0;
                this.string = 'example string';
            }
    });

    var example = new Example();

    example.count; /* undefined */

## Class public storage

**classPublic** is copied by reference to the class definition and class instances. 

    var Example = new Class({
        classPublic:
            {
                string: 'class public'
            },
        construct:
            function() {
                this.count = 0;
                this.string = 'example string';
            }
    });

    var example = new Example();

    example.classPublic.string; /* 'class public' */

    Example.classPublic.string; /* 'class public' */

## Class static storage

**classStatic** is copied by reference to the class definition.

    var Example = new Class({
        $classStatic:
            {
                string: 'class static'
            },
        construct:
            function() {
                this.count = 0;
                this.string = 'example string';
            }
    });

    var example = new Example();

    example.classStatic.string; /* undefined */

    Example.classStatic.string; /* 'class static' */

## Class private storage

**_classPrivate** is copied by reference to class instances.

    var Example = new Class({
        _classPrivate:
            {
                string: 'class private'
            },
        construct:
            function() {
                this.count = 0;
                this.string = 'example string';
            }
        getClassPrivate:
            function() {
                return this._classPrivate.string;
            }
    });

    var example = new Example();

    var extend = new Extend();

    example.classPublic.string; /* undefined */

    Example.classPublic.string; /* undefined */

    example.getClassPrivate(); /* returns 'class private' */

    extend.getClassPrivate(); /* returns 'class private' */ 

# Properties

**string** becomes a property on class instances.

    var Example = new Class({
        construct:
            function() {
                this.count = 0;
                this.string = 'example string';
            },
        defineProperties:
            {
                string:
                {
                    get:
                        function() {
                            return this.string;
                        }
                }
            }
    });

    var example = new Example();

    example.string; /* 'example string' */

## Quirks

    var Example = new Class({
        construct:
            function() {
                this.count = 0;
                this.string = 'example string';
            },
        getThis:
            function() {
                return this;
            }
    });

    var example = new Example();

    var privateExample = example.getThis();

    example === privateExample /* false */

    example instanceof Example /* true */

    privateExample instanceof Example /* true */
