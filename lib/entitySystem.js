/**
 * The most raw entity system. It should not typically be used, but you can create your own
 * entity system handling by extending this. It is recommended that you use the other provided
 * entity system implementations.
 *
 */
var entitySystem = (function () {
  var SystemIndexManager = (function () {
    var INDEX = 0;
    var indices = Object.create(null);

    return {
      getIndexFor: function (systemType) {
        if (!systemType) {
          return -1;
        }
        var idx = indices[systemType];
        if (!idx) {
          idx = INDEX++;
          indices[systemType] = idx;
        }
        return idx;
      }
    };
  })();

  var entitySystemClosure = function (aspect) {
    var systemIndex = SystemIndexManager.getIndexFor(this.systemType);
    var actives = bag();
    var allSet = aspect.getAllSet();
    var exclusionSet = aspect.getExclusionSet();
    var oneSet = aspect.getOneSet();
    // This system can't possibly be interested in any entity, so it must be "dummy"
    var dummy = allSet.isEmpty() && oneSet.isEmpty();
    var passive = false;
    var world;

    function process() {
      if (this.checkProcessing()) {
        this.begin();
        this.processEntities(actives);
        this.end();
      }
    }

    function removeFromSystem(entity) {
      actives.removeElement(entity);
      entity.getSystemBits().clear(systemIndex);
      this.removed(entity);
    }

    function insertToSystem(entity) {
      actives.add(entity);
      entity.getSystemBits().set(systemIndex);
      this.inserted(entity);
    }

    /**
     * Will check if the entity is of interest to this system.
     * @param entity to check
     */
    function check(entity) {
      if (dummy) {
        return;
      }

      var contains = entity.getSystemBits().get(systemIndex);
      var interested = true; // possibly interested, let's try to prove it wrong.

      var componentBits = entity.getComponentBits();

      // Check if the entity possesses ALL of the components defined in the aspect.
      if (!allSet.isEmpty()) {
        for (var i = allSet.nextSetBit(0); i >= 0; i = allSet.nextSetBit(i + 1)) {
          if (!componentBits.get(i)) {
            interested = false;
            break;
          }
        }
      }

      // Check if the entity possesses ANY of the exclusion components, if it does then the system is not interested.
      if (!exclusionSet.isEmpty() && interested) {
        interested = !exclusionSet.intersects(componentBits);
      }

      // Check if the entity possesses ANY of the components in the oneSet. If so, the system is interested.
      if (!oneSet.isEmpty()) {
        interested = oneSet.intersects(componentBits);
      }

      if (interested && !contains) {
        insertToSystem.call(this, entity);
      } else if (!interested && contains) {
        removeFromSystem.call(this, entity);
      }
    }

    this.isPassive = function isPassive() {
      return passive;
    };

    this.setPassive = function setPassive(pssv) {
      passive = pssv;
    };

    this.getActives = function getActives() {
      return actives;
    };

    function toRemove(entity) {
      if (entity.getSystemBits().get(systemIndex)) {
        removeFromSystem.call(this, entity);
      }
    }

    this.process = process;
    this.check = check;
    this.added = check;
    this.changed = check;
    this.deleted = toRemove;
    this.disabled = toRemove;
    this.enabled = check;

    this.setWorld = function (w) {
      world = w;
    };
    this.getWorld = function () {
      return world;
    };
  };

  var entitySystem = Helper.extendSystem(base, "entitySystem", entityObserver, {
    /**
     * Creates an entity system that uses the specified aspect as a matcher against entities.
     * @param aspect to match against entities
     */
    create: function create(aspect) {
      var self = Object.create(this);
      entitySystemClosure.call(self, aspect);
      return self;
    },
    /**
     * Called if the system has received a entity it is interested in, e.g. created or a component was added to it.
     * @param entity the entity that was added to this system.
     */
    inserted: function inserted(entity) {
    },
    /**
     * Called if a entity was removed from this system, e.g. deleted or had one of it's components removed.
     * @param entity the entity that was removed from this system.
     */
    removed: function removed(entity) {
    },
    /**
     * Override to implement code that gets executed when systems are initialized.
     */
    initialize: function initialize() {
    },
    /**
     * Called before processing of entities begins.
     */
    begin: function begin() {
    },
    /**
     * Called after the processing of entities ends.
     */
    end: function end() {
    },
    /**
     *
     * @return true if the system should be processed, false if not.
     */
    checkProcessing: function checkProcessing() {
      return false;
    },
    /**
     * Any implementing entity system must implement this method and the logic
     * to process the given entities of the system.
     *
     * @param entities the entities this system contains.
     */
    processEntities: function processEntities(entities) {
      throw {"NotImplemented": "Not supported yet. Override processEntities when extending"};
    }
  });

  return entitySystem;
})();