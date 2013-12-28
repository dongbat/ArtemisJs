/**
 * Manager.
 *
 * @author Arni Arent
 *
 */
var manager = base.extend(entityObserver, {
  initialize: function initialize() {
  },
  setWorld: function setWorld(world) {
    this.world = world;
  },
  getWorld: function getWorld() {
    return this.world;
  }
});

// add identifier for manager - use for identifying managers
// overwrite when extend
Object.defineProperty(manager, "managerType", {
  value: "manager",
  configurable: true,
  enumerable: false,
  writable: false
});