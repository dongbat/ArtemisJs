/**
 * This system has an empty aspect so it processes no entities, but it still gets invoked.
 * You can use this system if you need to execute some game logic and not have to concern
 * yourself about aspects or entities.
 *
 * @author Arni Arent
 *
 */
d8.voidEntitySystem = d8.Helper.extendSystem(d8.entitySystem, "voidEntitySystem", {
  create: function () {
    var self = d8.entitySystem.create.call(this, d8.Aspect.getEmpty());
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