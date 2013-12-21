/**
 * You may sometimes want to specify to which player an entity belongs to.
 *
 * An entity can only belong to a single player at a time.
 *
 * @author Arni Arent
 *
 */
d8.playerManager = (function () {
  var playerManagerClosure = function () {
    var playerByEntity = Object.create(null);
    var entitiesByPlayer = Object.create(null);

    this.setPlayer = function setPlayer(entity, player) {
      playerByEntity[entity.getUuid()] = player;
      var entities = entitiesByPlayer[player];
      if (!entities) {
        entities = bag();
        entitiesByPlayer[player] = entities;
      }
      entities.add(entity);
    };

    this.getEntitiesOfPlayer = function getEntitiesOfPlayer(player) {
      var entities = entitiesByPlayer[player];
      if (!entities) {
        entities = bag();
        entitiesByPlayer[player] = entities;
      }
      return entities;
    };

    function removeFromPlayer(entity) {
      var player = playerByEntity[entity.getUuid()];
      if (player) {
        var entities = entitiesByPlayer[player];
        if (entities) {
          entities.removeElement(entity);
        }
      }
    }

    this.removeFromPlayer = removeFromPlayer;

    this.getPlayer = function getPlayer(entity) {
      return playerByEntity[entity.getUuid()];
    };

    this.deleted = function deleted(entity) {
      removeFromPlayer(entity);
    };
  };

  var playerManager = d8.Helper.extendManager(d8.manager, "playerManager", {
    create: function () {
      var self = Object.create(this);
      playerManagerClosure.call(self);
      return self;
    }
  });
  return playerManager;
})();
