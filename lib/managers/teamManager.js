/**
 * Use this class together with PlayerManager.
 *
 * You may sometimes want to create teams in your game, so that
 * some players are team mates.
 *
 * A player can only belong to a single team.
 *
 * @author Arni Arent
 *
 */
d8.teamManager = (function () {
  var teamManagerClosure = function () {
    var playersByTeam = Object.create(null);
    var teamByPlayer = Object.create(null);

    this.getTeam = function getTeam(player) {
      return teamByPlayer[player];
    };

    this.setTeam = function setTeam(player, team) {
      removeFromTeam(player);

      teamByPlayer[player] = team;

      var players = playersByTeam[team];
      if (players == null) {
        players = bag();
        playersByTeam[team] = players;
      }
      players.add(player);
    };

    this.getPlayers = function getPlayers(team) {
      return playersByTeam[team];
    };

    function removeFromTeam(player) {
      var team = teamByPlayer[player];
      delete teamByPlayer[player];
      if (team != null) {
        var players = playersByTeam[team];
        if (players != null) {
          players.removeElement(player);
        }
      }
    }

    this.removeFromTeam = removeFromTeam;
  };

  var teamManager = d8.Helper.extendManager(d8.manager, "managerType", {
    create: function () {
      var self = Object.create(this);
      teamManagerClosure.call(self);
      return self;
    }
  });
  return teamManager;
})();