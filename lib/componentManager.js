var componentManager = (function () {
  var componentManagerClosure = function () {
    var componentsByType = bag();
    var deleted = bag();

    function removeComponentsOfEntity(entity) {
      var componentBits = entity.getComponentBits();
      for (var i = componentBits.nextSetBit(0); i >= 0; i = componentBits.nextSetBit(i + 1)) {
        componentsByType.get(i).set(entity.getId(), null);
      }
      componentBits.clear();
    }

    this.addComponent = function addComponent(entity, componentType, component) {
      var components = this.getComponentsByType(componentType);
      components.set(entity.getId(), component);
      entity.getComponentBits().set(componentType.getIndex());
    };

    this.removeComponent = function removeComponent(entity, componentType) {
      var componentBits = entity.getComponentBits();
      if (componentBits.get(componentType.getIndex())) {
        componentsByType.get(componentType.getIndex()).set(entity.getId(), null);
        componentBits.clear(componentType.getIndex());
      }
    };

    this.getComponentsByType = function getComponentsByType(componentType) {
      var components = componentsByType.get(componentType.getIndex());
      if (!components) {
        components = bag();
        componentsByType.set(componentType.getIndex(), components);
      }
      return components;
    };

    this.getComponent = function getComponent(entity, componentType) {
      var components = componentsByType.get(componentType.getIndex());
      if (components) {
        return components.get(entity.getId());
      }
      return null;
    };

    this.getComponentsFor = function getComponentsFor(entity, fillBag) {
      var componentBits = entity.getComponentBits();

      for (var i = componentBits.nextSetBit(0); i >= 0; i = componentBits.nextSetBit(i + 1)) {
        fillBag.add(componentsByType.get(i).get(entity.getId()));
      }

      return fillBag;
    };

    this.deleted = function deletedFunc(entity) {
      deleted.add(entity);
    };

    this.clean = function clean() {
      if (deleted.size() > 0) {
        for (var i = 0; deleted.size() > i; i++) {
          removeComponentsOfEntity(deleted.get(i));
        }
        deleted.clear();
      }
    };
  };

  var componentManager = Helper.extendManager(manager, "componentManager", {
    create: function () {
      var self = Object.create(this);
      componentManagerClosure.call(self);
      return self;
    }
  });
  return componentManager;
})();