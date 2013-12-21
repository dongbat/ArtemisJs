/**
 * If you need to group your entities together, e.g. tanks going into "units" group or explosions into "effects",
 * then use this manager. You must retrieve it using world instance.
 *
 * A entity can be assigned to more than one group.
 *
 * @author Arni Arent
 *
 */
d8.groupManager = (function () {
  var groupManagerClosure = function () {
    var entitiesByGroup = Object.create(null);
    var groupsByEntity = Object.create(null);

    /**
     * Set the group of the entity.
     *
     * @param entity to add into the group.
     * @param group group to add the entity into.
     */
    this.add = function add(entity, group) {
      var entities = entitiesByGroup[group];
      if (!entities) {
        entities = bag();
        entitiesByGroup[group] = entities;
      }
      entities.add(entity);

      var groups = groupsByEntity[entity.getUuid()];
      if (!groups) {
        groups = bag();
        groupsByEntity[entity.getUuid()] = groups;
      }
      groups.add(group);
    };

    /**
     * Remove the entity from the specified group.
     * @param entity
     * @param group
     */
    this.remove = function remove(entity, group) {
      var entities = entitiesByGroup[group];
      if (entities) {
        entities.removeElement(entity);
      }
      var groups = groupsByEntity[entity.getUuid()];
      if (groups) {
        groups.removeElement(group);
      }
    };

    function removeFromAllGroups(entity) {
      var groups = groupsByEntity[entity.getUuid()];
      if (groups) {
        var entities;
        for (var i = 0; i < groups.size(); i++) {
          entities = entitiesByGroup[groups.get(i)];
          if (entities) {
            entities.removeElement(entity);
          }
        }
        groups.clear();
      }
    }

    this.removeFromAllGroups = removeFromAllGroups;

    /**
     * Get all entities that belong to the provided group.
     * @param group name of the group.
     * @return read-only bag of entities belonging to the group.
     */
    this.getEntities = function getEntities(group) {
      var entities = entitiesByGroup[group];
      if (!entities) {
        entities = bag();
        entitiesByGroup[group] = entities;
      }
      return entities;
    };

    /**
     * @param entity
     * @return the groups the entity belongs to, null if none.
     */
    this.getGroups = function getGroups(entity) {
      if (isInAnyGroup(entity)) {
        return groupsByEntity[entity.getUuid()];
      }
      return null;
    };

    /**
     * Checks if the entity belongs to any group.
     * @param entity to check.
     * @return true if it is in any group, false if none.
     */
    function isInAnyGroup(entity) {
      var groups = groupsByEntity[entity.getUuid()];
      return groups && !groups.isEmpty();
    }

    this.isInAnyGroup = isInAnyGroup;

    /**
     * Check if the entity is in the supplied group.
     * @param entity to check for.
     * @param group the group to check in.
     * @return true if the entity is in the supplied group, false if not.
     */
    this.isInGroup = function isInGroup(entity, group) {
      var groups = groupsByEntity[entity.getUuid()];
      return groups && groups.contains(group);
    };

    this.deleted = function deleted(entity) {
      removeFromAllGroups(entity);
    };
  };

  var groupManager = d8.Helper.extendManager(d8.manager, "groupManager", {
    create: function () {
      var self = Object.create(this);
      groupManagerClosure.call(self);
      return self;
    }
  });
  return groupManager;
})();