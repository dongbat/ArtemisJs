/**
 * The entity class. Cannot be instantiated outside the framework, you must
 * create new entities using World.
 *
 */
var entity = (function () {
  var entityClosure = function (world, id) {
    var pUuid;
    var componentBits = bitSet();
    var systemBits = bitSet();
    var entityManager = world.getEntityManager();
    var componentManager = world.getComponentManager();

    /**
     * Make entity ready for re-use.
     * Will generate a new uuid for the entity.
     */
    this.reset = function reset() {
      componentBits.clear();
      systemBits.clear();
      pUuid = uuid();
    };

    /**
     * The internal id for this entity within the framework. No other entity
     * will have the same ID, but ID's are however reused so another entity may
     * acquire this ID if the previous entity was deleted.
     *
     * @return id of the entity.
     */
    this.getId = function getId() {
      return id;
    };

    /**
     * Returns a BitSet instance containing bits of the components the entity possesses.
     * @return
     */
    this.getComponentBits = function getComponentBits() {
      return componentBits;
    };

    /**
     * Returns a BitSet instance containing bits of the components the entity possesses.
     * @return
     */
    this.getSystemBits = function getSystemBits() {
      return systemBits;
    };

    /**
     * Get the UUID for this entity.
     * This UUID is unique per entity (re-used entities get a new UUID).
     * @return uuid instance for this entity.
     */
    this.getUuid = function getUuid() {
      return pUuid;
    };

    /**
     * Returns the world this entity belongs to.
     * @return world of entity.
     */
    this.getWorld = function getWorld() {
      return world;
    };

    /**
     * Add a component to this entity.
     * Faster with componentType passed in as argument. Not necessarily to use this, but
     * in some cases you might need the extra performance.
     *
     * @param component to add to this entity
     * @param componentType of the component
     *
     * @return this entity for chaining.
     */
    this.addComponent = function addComponent(component, componentType) {
      var type = componentType;
      if (!type) {
        type = ComponentType.getTypeFor(component.componentType);
      }
      componentManager.addComponent(this, type, component);
      return this;
    };

    /**
     * Removes the component from this entity.
     *
     * @param component to remove from this entity.
     *
     * @return this entity for chaining.
     */
    this.removeComponent = function removeComponent(component) {
      return this.removeComponentByType(component.componentType);
    };

    /**
     * Remove component by its type.
     * Faster removal of components from a entity if componentType is a ComponentType object
     *
     * @param componentType a component type string or ComponentType object
     *
     * @return this entity for chaining.
     */
    this.removeComponentByType = function removeComponentByType(componentType) {
      var type = componentType;
      if (typeof type === "string") {
        type = ComponentType.getTypeFor(type);
      }
      componentManager.removeComponent(this, type);
      return this;
    };

    /**
     * Checks if the entity has been added to the world and has not been deleted from it.
     * If the entity has been disabled this will still return true.
     *
     * @return true if it's active; false otherwise
     */
    this.isActive = function isActive() {
      return entityManager.isActive(id);
    };

    /**
     * Will check if the entity is enabled in the world.
     * By default all entities that are added to world are enabled,
     * this will only return false if an entity has been explicitly disabled.
     *
     * @return true if it's enabled; false otherwise
     */
    this.isEnabled = function isEnabled() {
      return entityManager.isEnabled(id);
    };

    /**
     * Retrieving a component from an entity.
     * But the recommended way to retrieve components from an entity is using
     * the ComponentMapper.
     *
     * @param componentType
     *            in order to retrieve the component fast you must provide a
     *            ComponentType instance for the expected component.
     *            Slower if provided component type string
     * @return component that matches, or null if none is found.
     */
    this.getComponent = function getComponent(componentType) {
      var type = componentType;
      if (typeof type === "string") {
        type = ComponentType.getTypeFor(type);
      }
      return componentManager.getComponent(this, type);
    };

    /**
     * Returns a bag of all components this entity has.
     * You need to reset the bag yourself if you intend to fill it more than once.
     *
     * @param fillBag the bag to put the components into.
     * @return the fillBag with the components in.
     */
    this.getComponents = function getComponents(fillBag) {
      return componentManager.getComponentsFor(this, fillBag);
    };

    /**
     * Refresh all changes to components for this entity. After adding or
     * removing components, you must call this method. It will update all
     * relevant systems. It is typical to call this after adding components to a
     * newly created entity.
     */
    this.addToWorld = function addToWorld() {
      world.addEntity(this);
    };

    /**
     * This entity has changed, a component added or deleted.
     */
    this.changedInWorld = function changedInWorld() {
      world.changedEntity(this);
    };

    /**
     * Delete this entity from the world.
     */
    this.deleteFromWorld = function deleteFromWorld() {
      world.deleteEntity(this);
    };

    /**
     * (Re)enable the entity in the world, after it having being disabled.
     * Won't do anything unless it was already disabled.
     */
    this.enable = function enable() {
      world.enable(this);
    };

    /**
     * Disable the entity from being processed. Won't delete it, it will
     * continue to exist but won't get processed.
     */
    this.disable = function disable() {
      world.disable(this);
    };
  };

  var entity = {
    create: function (world, id) {
      var self = Object.create(this);
      entityClosure.call(self, world, id);
      self.reset();
      return self;
    }
  };

  return entity;
})();