/**
 * A system that processes entities at a interval in milliseconds.
 * A typical usage would be a collision system or physics system.
 *
 */
var intervalEntitySystem = (function () {
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

  var intervalEntitySystem = ExtendHelper.extendSystem(entitySystem, "intervalEntitySystem", {
    create: function (aspect, interval) {
      var self = entitySystem.create.call(this, aspect);
      intervalEntitySystemClosure.call(self, interval);
      return self;
    }
  });
  return intervalEntitySystem;
})();