/**
 * An Aspects is used by systems as a matcher against entities, to check if a system is
 * interested in an entity. Aspects define what sort of component types an entity must
 * possess, or not possess.
 *
 * This creates an aspect where an entity must possess component Type A and B and C:
 * Aspect.getAspectForAll(componentType_A, componentType_B, componentType_C)
 *
 * This creates an aspect where an entity must possess component Type A and B and C, but must not possess U or V.
 * Aspect.getAspectForAll(componentType_A, componentType_B, componentType_C)
 *    .exclude(componentType_U, componentType_V)
 *
 * This creates an aspect where an entity must possess A and B and C, but must not possess U or V, but must possess one of X or Y or Z.
 * Aspect.getAspectForAll(componentType_A, componentType_B, componentType_C)
 *    .exclude(componentType_U, componentType_V)
 *    .one(componentType_X, componentType_Y, componentType_Z)
 *
 * You can create and compose aspects in many ways:
 * Aspect.getEmpty().one(componentType_X, componentType_Y, componentType_Z)
 *    .all(componentType_A, componentType_B, componentType_C)
 *    .exclude(componentType_U, componentType_V)
 * is the same as:
 * Aspect.getAspectForAll(componentType_A, componentType_B, componentType_C)
 *    .exclude(componentType_U, componentType_V)
 *    .one(componentType_X, componentType_Y, componentType_Z)
 *
 */
var Aspect = (function () {
  var aspectClosure = function () {
    var allSet = bitSet();
    var exclusionSet = bitSet();
    var oneSet = bitSet();

    function setBits(bitset, types) {
      for (var i = 0; i < types.length; i++) {
        bitset.set(ComponentType.getIndexFor(types[i]));
      }
    }

    this.getAllSet = function getAllSet() {
      return allSet;
    };

    this.getExclusionSet = function getExclusionSet() {
      return exclusionSet;
    };

    this.getOneSet = function getOneSet() {
      return oneSet;
    };

    /**
     * Returns an aspect where an entity must possess all of the specified component types.
     * @param type a required component type
     * @param types a required component type
     * @return an aspect that can be matched against entities
     */
    this.all = function all(type, types) {
      setBits(allSet, arguments);
      return this;
    };

    /**
     * Excludes all of the specified component types from the aspect. A system will not be
     * interested in an entity that possesses one of the specified exclusion component types.
     *
     * @param type component type to exclude
     * @param types component type to exclude
     * @return an aspect that can be matched against entities
     */
    this.exclude = function exclude(type, types) {
      setBits(exclusionSet, arguments);
      return this;
    };

    /**
     * Returns an aspect where an entity must possess one of the specified component types.
     * @param type one of the types the entity must possess
     * @param types one of the types the entity must possess
     * @return an aspect that can be matched against entities
     */
    this.one = function one(type, types) {
      setBits(oneSet, arguments);
      return this;
    };
  };

  function createAspect() {
    var self = {};
    aspectClosure.call(self);
    return self;
  }

  return {
    /**
     * Creates an aspect where an entity must possess all of the specified component types.
     *
     * @param type a required component type
     * @param types a required component type
     * @return an aspect that can be matched against entities
     */
    getAspectForAll: function getAspectForAll(type, types) {
      var aspect = createAspect();
      aspect.all.apply(aspect, arguments);
      return aspect;
    },
    /**
     * Creates an aspect where an entity must possess one of the specified component types.
     *
     * @param type one of the types the entity must possess
     * @param types one of the types the entity must possess
     * @return an aspect that can be matched against entities
     */
    getAspectForOne: function getAspectForOne(type, types) {
      var aspect = createAspect();
      aspect.one.apply(aspect, arguments);
      return aspect;
    },
    /**
     * Creates and returns an empty aspect. This can be used if you want a system that processes no entities, but
     * still gets invoked. Typical usages is when you need to create special purpose systems for debug rendering,
     * like rendering FPS, how many entities are active in the world, etc.
     *
     * You can also use the all, one and exclude methods on this aspect, so if you wanted to create a system that
     * processes only entities possessing just one of the components A or B or C, then you can do:
     * Aspect.getEmpty().one(A,B,C);
     *
     * @return an empty Aspect that will reject all entities.
     */
    getEmpty: function getEmpty() {
      return createAspect();
    }
  };
})();