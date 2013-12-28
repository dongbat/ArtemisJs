d8.entityManager = (function () {
  var identifierPool = function () {
    var ids = bag();
    var nextAvailableId = 0;
    return {
      checkOut: function () {
        if (ids.size() > 0) {
          return ids.removeLast();
        }
        return nextAvailableId++;
      },
      checkIn: function (id) {
        ids.add(id);
      }
    };
  };
  var entityManagerClosure = function () {
    var entities = bag();
    var disabled = bitSet();
    var active = 0;
    var added = 0;
    var created = 0;
    var deleted = 0;
    var idPool = identifierPool();

    this.createEntityInstance = function createEntityInstance() {
      var e = d8.entity.create(this.getWorld(), idPool.checkOut());
      created++;
      return e;
    };

    this.added = function addedFunc(entity) {
      active++;
      added++;
      entities.set(entity.getId(), entity);
    };

    this.enabled = function enabled(entity) {
      disabled.clear(entity.getId());
    };

    this.disabled = function disabledFunc(entity) {
      disabled.set(entity.getId());
    };

    this.deleted = function deletedFunc(entity) {
      entities.set(entity.getId(), null);

      disabled.clear(entity.getId());

      idPool.checkIn(entity.getId());

      active--;
      deleted++;
    };

    /**
     * Check if this entity is active.
     * Active means the entity is being actively processed.
     *
     * @param entityId
     * @return true if active, false if not.
     */
    this.isActive = function isActive(entityId) {
      return entities.get(entityId) ? true : false;
    };

    /**
     * Check if the specified entityId is enabled.
     *
     * @param entityId
     * @return true if the entity is enabled, false if it is disabled.
     */
    this.isEnabled = function isEnabled(entityId) {
      return !disabled.get(entityId);
    };

    /**
     * Get a entity with this id.
     *
     * @param entityId
     * @return the entity
     */
    this.getEntity = function getEntity(entityId) {
      return entities.get(entityId);
    };

    /**
     * Get how many entities are active in this world.
     * @return how many entities are currently active.
     */
    this.getActiveEntityCount = function getActiveEntityCount() {
      return active;
    };

    /**
     * Get how many entities have been created in the world since start.
     * Note: A created entity may not have been added to the world, thus
     * created count is always equal or larger than added count.
     * @return how many entities have been created since start.
     */
    this.getTotalCreated = function getTotalCreated() {
      return created;
    };

    /**
     * Get how many entities have been added to the world since start.
     * @return how many entities have been added.
     */
    this.getTotalAdded = function getTotalAdded() {
      return added;
    };

    /**
     * Get how many entities have been deleted from the world since start.
     * @return how many entities have been deleted since start.
     */
    this.getTotalDeleted = function getTotalDeleted() {
      return deleted;
    };
  };

  var entityManager = d8.Helper.extendManager(d8.manager, "entityManager", {
    create: function () {
      var self = Object.create(this);
      entityManagerClosure.call(self);
      return self;
    }
  });
  return entityManager;
})();