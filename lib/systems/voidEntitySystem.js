/**
 * This system has an empty aspect so it processes no entities, but it still gets invoked.
 * You can use this system if you need to execute some game logic and not have to concern
 * yourself about aspects or entities.
 *
 */
var voidEntitySystem = Helper.extendSystem(entitySystem, "voidEntitySystem", {
  create: function () {
    var self = entitySystem.create.call(this, Aspect.getEmpty());
    return self;
  },
  processSystem: function processSystem() {
    throw ({"NotImplemented": "Not supported yet. Override processSystem when extending"});
  },
  processEntities: function processEntities() {
    this.processSystem.call(this);
  },

  checkProcessing: function () {
    return true;
  }
});