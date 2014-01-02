/**
 * The primary instance for the framework. It contains all the managers.
 *
 * You must use this to create, delete and retrieve entities.
 *
 * It is also important to set the delta each game loop iteration, and initialize before game loop.
 *
 * @author Arni Arent
 *
 */
var world = (function () {
  var worldClosure = function () {
    var entityManager = artemis.entityManager.create();
    var componentManager = artemis.componentManager.create();

    var delta = 0;
    var added = bag();
    var changed = bag();
    var deleted = bag();
    var enable = bag();
    var disable = bag();

    var managers = Object.create(null);
    var managersBag = bag();

    var systems = Object.create(null);
    var systemsBag = bag();

    function setComponentMapper(system, world) {
      if (system.__componentTypes) {
        var requestedTypes = system.__componentTypes;
        if (typeof requestedTypes === "string") {
          requestedTypes = [requestedTypes];
        }
        if (!Array.isArray(requestedTypes) || requestedTypes.length === 0) {
          return;
        }
        var requestedType;
        for (var i = 0; i < requestedTypes.length; i++) {
          requestedType = requestedTypes[i];
          var componentMapper = world.getMapper(requestedType);
          Object.defineProperty(system, requestedType + "Mapper", {
            value: componentMapper,
            configurable: false,
            enumerable: true,
            writable: false
          });
        }
      }
    }

    /**
     * Makes sure all managers systems are initialized in the order they were added.
     */
    this.initialize = function initialize() {
      var manager;
      for (var i = 0; i < managersBag.size(); i++) {
        manager = managersBag.get(i);
        manager.initialize.call(manager);
      }

      var system;
      for (i = 0; i < systemsBag.size(); i++) {
        system = systemsBag.get(i);
        setComponentMapper(system, this);
        system.initialize.call(system);
      }
    };

    /**
     * Returns a manager that takes care of all the entities in the world.
     * entities of this world.
     *
     * @return entity manager.
     */
    this.getEntityManager = function getEntityManager() {
      return entityManager;
    };

    /**
     * Returns a manager that takes care of all the components in the world.
     *
     * @return component manager.
     */
    this.getComponentManager = function getComponentManager() {
      return componentManager;
    };

    /**
     * Add a manager into this world. It can be retrieved later.
     * World will notify this manager of changes to entity.
     *
     * @param manager to be added
     */
    this.setManager = function setManager(manager) {
      managers[manager.managerType] = manager;
      managersBag.add(manager);
      manager.setWorld(this);
      return manager;
    };

    /**
     * Returns a manager of the specified type.
     *
     * @param managerType
     *            class type of the manager
     * @return the manager
     */
    this.getManager = function getManager(managerType) {
      return managers[managerType];
    };

    /**
     * Deletes the manager from this world.
     * @param manager to delete.
     */
    this.deleteManager = function deleteManager(manager) {
      delete managers[manager.managerType];
      managersBag.removeElement(manager);
    };

    /**
     * Time since last game loop.
     *
     * @return delta time since last game loop.
     */
    this.getDelta = function getDelta() {
      return delta;
    };

    /**
     * You must specify the delta for the game here.
     *
     * @param dt time since last game loop.
     */
    this.setDelta = function setDelta(dt) {
      delta = dt;
    };

    /**
     * Adds a entity to this world.
     *
     * @param entity
     */
    this.addEntity = function addEntity(entity) {
      added.add(entity);
    };

    /**
     * Ensure all systems are notified of changes to this entity.
     * If you're adding a component to an entity after it's been
     * added to the world, then you need to invoke this method.
     *
     * @param entity
     */
    this.changedEntity = function changedEntity(entity) {
      changed.add(entity);
    };

    /**
     * Delete the entity from the world.
     *
     * @param entity
     */
    this.deleteEntity = function deleteEntity(entity) {
      if (!deleted.contains(entity)) {
        deleted.add(entity);
      }
    };

    /**
     * (Re)enable the entity in the world, after it having being disabled.
     * Won't do anything unless it was already disabled.
     */
    this.enable = function enableFunc(entity) {
      enable.add(entity);
    };

    /**
     * Disable the entity from being processed. Won't delete it, it will
     * continue to exist but won't get processed.
     */
    this.disable = function disableFunc(entity) {
      disable.add(entity);
    };

    /**
     * Create and return a new or reused entity instance.
     * Will NOT add the entity to the world, use World.addEntity(Entity) for that.
     *
     * @return entity
     */
    this.createEntity = function createEntity() {
      return entityManager.createEntityInstance();
    };

    /**
     * Get a entity having the specified id.
     *
     * @param entityId
     * @return entity
     */
    this.getEntity = function getEntity(entityId) {
      return entityManager.getEntity(entityId);
    };

    /**
     * Gives you all the systems in this world for possible iteration.
     *
     * @return all entity systems in world.
     */
    this.getSystems = function getSystems() {
      return systemsBag;
    };

    /**
     * Adds a system to this world that will be processed by World.process()
     *
     * @param system the system to add.
     * @param passive whether or not this system will be processed by World.process()
     * @return the added system.
     */
    this.setSystem = function setSystem(system, passive) {
      system.setWorld(this);
      system.setPassive(passive);

      systems[system.systemType] = system;
      systemsBag.add(system);

      return system;
    };

    /**
     * Removed the specified system from the world.
     * @param system to be deleted from world.
     */
    this.deleteSystem = function deleteSystem(system) {
      delete systems[system.systemType];
      systemsBag.removeElement(system);
    };

    /**
     * Retrieve a system for specified system type.
     *
     * @param systemType type of system.
     * @return instance of the system in this world.
     */
    this.getSystem = function getSystem(systemType) {
      return systems[systemType];
    };

    /**
     * Retrieves a ComponentMapper instance for fast retrieval of components from entities.
     *
     * @param type of component to get mapper for.
     * @return mapper for specified component type.
     */
    this.getMapper = function getMapper(componentType) {
      return ComponentMapper.getFor(componentType, this);
    };

    function notify(bag, entity, action) {
      var tmp;
      for (var i = 0; i < bag.size(); i++) {
        tmp = bag.get(i);
        if (tmp[action]) {
          tmp[action].call(tmp, entity);
        }
      }
    }

    /**
     * Performs an action on each entity.
     * @param entities
     * @param action
     */
    function check(entities, action) {
      if (!entities.isEmpty()) {
        var entity;
        for (var i = 0; i < entities.size(); i++) {
          entity = entities.get(i);
          notify(managersBag, entity, action);
          notify(systemsBag, entity, action);
        }
        entities.clear();
      }
    }

    /**
     * Process all non-passive systems.
     */
    this.process = function process() {
      check(added, "added");
      check(changed, "changed");
      check(disable, "disabled");
      check(enable, "enabled");
      check(deleted, "deleted");

      componentManager.clean();

      var system;
      for (var i = 0; i < systemsBag.size(); i++) {
        system = systemsBag.get(i);
        if (!system.isPassive()) {
          system.process.call(system);
        }
      }
    };

    this.setManager(entityManager);
    this.setManager(componentManager);
  };

  var world = base.extend({
    create: function () {
      var self = Object.create(this);
      worldClosure.call(self);
      return self;
    }
  });

  return world;
})();