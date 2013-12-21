/**
 * If you need to process entities at a certain interval then use this.
 * A typical usage would be to regenerate ammo or health at certain intervals, no need
 * to do that every game loop, but perhaps every 100 ms. or every second.
 *
 * @author Arni Arent
 *
 */
d8.intervalEntityProcessingSystem = d8.Helper.extendSystem(d8.entityProcessingSystem, "intervalEntityProcessingSystem", {
  create: function (aspect, interval) {
    var self = d8.entityProcessingSystem.create.call(this, aspect);
    self = d8.intervalEntitySystem.create.call(self, aspect, interval);
    return self;
  }
});