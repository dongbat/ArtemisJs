/**
 * A system that processes entities at a interval in milliseconds.
 * A typical usage would be a collision system or physics system.
 *
 * @author Arni Arent
 *
 */
d8.intervalEntitySystem = (function () {
  var intervalEntitySystemClosure = function (interval) {
    var acc = 0;

    this.checkProcessing = function checkProcessing() {
      acc += this.getWorld().getDelta();
      if (acc >= interval) {
        acc -= interval;
        return true;
      }
      return false;
    };
  };

  var intervalEntitySystem = d8.Helper.extendSystem(d8.entitySystem, "intervalEntitySystem", {
    create: function (aspect, interval) {
      var self = d8.entitySystem.create.call(this, aspect);
      intervalEntitySystemClosure.call(self, interval);
      return self;
    }
  });
  return intervalEntitySystem;
})();