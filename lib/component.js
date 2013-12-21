/**
 * A tag class. All components in the system must extend this class.
 * Extended components are required to set a different componentType for each component type
 * @author Arni Arent
 */
d8.component = d8.base.extend({
  create: function () {
    return Object.create(this);
  }
});

Object.defineProperty(d8.component, "componentType", {
  value: "component",
  configurable: true,
  enumerable: false,
  writable: false
});