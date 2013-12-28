var ComponentMapper = (function () {
  var closure = function (componentType, world) {
    var type = ComponentType.getTypeFor(componentType);
    var components = world.getComponentManager().getComponentsByType(type);

    /**
     * Fast but unsafe retrieval of a component for this entity.
     * No bounding checks, so this could return undefined,
     * however in most scenarios you already know the entity possesses this component.
     *
     * @param e the entity that should possess the component
     * @return the instance of the component
     */
    this.get = function (e) {
      return components.get(e.getId());
    };

    /**
     * Fast and safe retrieval of a component for this entity.
     * If the entity does not have this component then null is returned.
     *
     * @param e the entity that should possess the component
     * @return the instance of the component
     */
    this.getSafe = function (e) {
      if (components.isIndexWithinBounds(e.getId())) {
        return components.get(e.getId());
      }
      return null;
    };

    /**
     * Checks if the entity has this type of component.
     * @param e the entity to check
     * @return true if the entity has this component type, false if it doesn't.
     */
    this.has = function (e) {
      return components.isIndexWithinBounds(e.getId());
    };
  };

  return {
    /**
     * Returns a component mapper for this type of components.
     *
     * @param componentType the type of components this mapper uses.
     * @param world the world that this component mapper should use.
     * @return a new mapper.
     */
    getFor: function (componentType, world) {
      var componentMapper = {};
      closure.call(componentMapper, componentType, world);
      return componentMapper;
    }
  };
})();