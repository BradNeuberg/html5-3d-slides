/**
 * classList.js: Implements a cross-browser element.classList getter.
 * 
 * Initial code by Eli Grey, http://eligrey.com 2010-02-14
 * Fix for non-existent or empty class by M.-A. Darche 2010-07-24
 *
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */
"use strict";
if (typeof Element !== "undefined") {
(function () {
var classListProp = "classList";
if (!Element.prototype.hasOwnProperty(classListProp)) {
    var trim = /^\s+|\s+$/g,
    setClasses = function (elem, classes) {
        elem.className = classes.join(" ");
    },
    checkAndGetIndex = function (classes, token) {
        if (token === "") {
            throw "SYNTAX_ERR";
        }
        if (/\s/.test(token)) {
            throw "INVALID_CHARACTER_ERR";
        }

        return classes.indexOf(token);
    },
    classListGetter = function () {
        var elem = this;
        var classNameTrimmed = elem.className.replace(trim, "");
        // Note that a split on an empty string returns an array with an empty string
        var classes = classNameTrimmed ? classNameTrimmed.split(/\s+/) : [];

        return {
            length: classes.length,
            item: function (i) {
                return classes[i] || null;
            },
            contains: function (token) {
                return checkAndGetIndex(classes, token) !== -1;
            },
            add: function (token) {
                if (checkAndGetIndex(classes, token) === -1) {
                    classes.push(token);
                    this.length = classes.length;
                    setClasses(elem, classes);
                }
            },
            remove: function (token) {
                var index = checkAndGetIndex(classes, token);
                if (index !== -1) {
                    classes.splice(index, 1);
                    this.length = classes.length;
                    setClasses(elem, classes);
                }
            },
            toggle: function (token) {
                if (checkAndGetIndex(classes, token) === -1) {
                    this.add(token);
                } else {
                    this.remove(token);
                }
            },
            toString: function () {
                return elem.className;
            }
        };
    };

    if (Object.defineProperty) {
        Object.defineProperty(Element.prototype, classListProp, { get: classListGetter, enumerable: true });
    } else if (Object.prototype.__defineGetter__) {
        Element.prototype.__defineGetter__(classListProp, classListGetter);
    }
}
}());
}