/**
 * base prototype to be extended
 * @type {prototype|*}
 */
var base = Object.create(Object.prototype);

/**
 * Extend this object with one or more objects.
 * Copy all property to extending object (concatenation)
 * If private members are needed, use blueprint/closure
 */
Object.defineProperty(base, "extend", {
  value: function () {
    var hasOwnProperty = Object.hasOwnProperty;
    var object = Object.create(this);
    var length = arguments.length;
    var index = length;

    while (index) {
      var extension = arguments[length - (index--)];

      for (var property in extension) {
        if (hasOwnProperty.call(extension, property) || typeof object[property] === "undefined") {
          object[property] = extension[property];
        }
      }
    }

    return object;
  },
  configurable: false,
  enumerable: false,
  writable: true
});