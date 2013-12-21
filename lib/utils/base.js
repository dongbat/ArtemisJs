this.d8 = Object.create(null);

/**
 * base prototype to be extended
 * @type {prototype|*}
 */
d8.base = Object.create(Object.prototype);

/**
 * Extend this object with one or more objects.
 * Copy all property to extending object (concatenation)
 * If private members are needed, use blueprint/closure
 */
Object.defineProperty(d8.base, "extend", {
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


//<editor-fold desc="Example">
var Rectangle = d8.base.extend({
  create: function (w, h) {
    var self = Object.create(this);
    self.height = h;
    self.width = w;
    return self;
  },
  area: function () {
    return this.width * this.height;
  }
});

r1 = Rectangle.create(4, 5);

// closure - extension with private members
function eventEmitter() {
  var events = Object.create(null);

  this.on = function (event, listener) {
    if (typeof events[event] !== "undefined")
      events[event].push(listener);
    else events[event] = [listener];
  };
  this.emit = function (event) {
    if (typeof events[event] !== "undefined") {
      var listeners = events[event];
      var length = listeners.length, index = length;
      var args = Array.prototype.slice.call(arguments, 1);

      while (index) {
        var listener = listeners[length - (index--)];
        listener.apply(this, args);
      }
    }
  };
}

var Square = Rectangle.extend({
  create: function (s) {
    var self = Rectangle.create.call(this, s, s);
    eventEmitter.call(self);
    return self;
  },
  resize: function (newSize) {
    var oldSize = this.width;
    this.width = this.height = newSize;
    this.emit("resize", oldSize, newSize);
  }
});

s1 = Square.create(3);

s1.on("resize", function (oldSize, newSize) {
  console.log("sq resized from " + oldSize + " to " + newSize + ".");
});
//</editor-fold>
