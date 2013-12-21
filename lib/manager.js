/**
 * Manager.
 *
 * @author Arni Arent
 *
 */
d8.manager = d8.base.extend(d8.entityObserver, {
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
Object.defineProperty(d8.manager, "managerType", {
  value: "manager",
  configurable: true,
  enumerable: false,
  writable: false
});