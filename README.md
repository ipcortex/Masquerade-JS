# Masquerade JS

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

**getString** will be available on instances of **Example** 

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

    (new Example()).getString() /* Returns 'example string' */

## Class private method

**_incrementCount** is only available from the **this** context.

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

    (new Example()).getString() /* Returns 'example string' and increments this.count */

## Class static method

**getDate** is available on the **Example** definition.

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

    Example.getDate(); /* Returns epoch */

## Class extension

**Extend** will inherit all methods from **Example**

    var Extend = Example.extend({
        construct:
            function() {
                this.count = 0;
                this.string = 'extend string';
            }
    });

    (new Example()).getString() /* Returns 'extend string' and increments this.count */

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

    (new Extend()).getString() /* Returns 'extend string *this.count' */

# Storage

## Private storage

Anything stored on **this** will be private to that instance.

    var Example = new Class({
        construct:
            function() {
                this.count = 0;
                this.string = 'example string';
            }
    });

## Class public storage

**classPublic** is avaiable on both the **Example** definition and instances of **Example** and **Extend**, assuming **Extend** has been extended from **Example**.

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


## Class static storage

**classStatic** is avaiable on the **Example** definition.

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

## Class private storage

**_classPrivate** is available to all instances of **Example** and **Extend**, assuming **Extend** has been extended from **Example**.

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
    });

# Properties

**string** is defined on any instance of **Example**.

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

    (new Example()).string; /* Outputs 'example string' */
