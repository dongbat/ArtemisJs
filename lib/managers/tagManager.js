/**
 * If you need to tag any entity, use this. A typical usage would be to tag
 * entities such as "PLAYER", "BOSS" or something that is very unique.
 *
 */
var tagManager = (function () {
  var tagManagerClosure = function () {
    var entitiesByTag = Object.create(Object.prototype);
    var tagsByEntity = Object.create(null);

    this.register = function register(tag, entity) {
      entitiesByTag[tag] = entity;
      tagsByEntity[entity.getUuid()] = tag;
    };

    this.unregister = function unregister(tag) {
      var entity = entitiesByTag[tag];
      delete entitiesByTag[tag];
      delete tagsByEntity[entity.getUuid()];
    };

    this.isRegistered = function isRegistered(tag) {
      return entitiesByTag[tag] ? true : false;
    };

    this.getEntity = function getEntity(tag) {
      return entitiesByTag[tag];
    };

    this.getRegisteredTags = function getRegisteredTags() {
      var tags = [];
      for (var key in entitiesByTag) {
        if (entitiesByTag.hasOwnProperty(key)) {
          tags.push(key);
        }
      }
      return tags;
    };

    this.deleted = function deleted(entity) {
      var removedTag = tagsByEntity[entity.getUuid()];
      delete tagsByEntity[entity.getUuid()];
      if (removedTag != null) {
        delete entitiesByTag[removedTag];
      }
    };
  };

  var tagManager = ExtendHelper.extendManager(manager, "tagManager", {
    create: function () {
      var self = Object.create(this);
      tagManagerClosure.call(self);
      return self;
    }
  });
  return tagManager;
})();