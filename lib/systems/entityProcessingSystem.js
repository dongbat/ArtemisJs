/**
 * A typical entity system. Use this when you need to process entities possessing the
 * provided component types.
 *
 */
var entityProcessingSystem = Helper.extendSystem(entitySystem, "entityProcessingSystem", {
  create: function (aspect) {
    var self = entitySystem.create.call(this, aspect);
    return self;
  },
  /**
   * Process a entity this system is interested in.
   * @param entity the entity to process.
   */
  processEntity: function process(entity) {
    throw ({"NotImplemented": "Not supported yet. Override process when extending"});
  },
  processEntities: function processEntities(entities) {
    for (var i = 0; i < entities.size(); i++) {
      this.processEntity(entities.get(i));
    }
  },
  checkProcessing: function checkProcessing() {
    return true;
  }
});