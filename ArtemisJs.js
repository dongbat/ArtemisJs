/*! ArtemisJs - v0.0.1 - 2013-12-28 *//**
 * Collection type a bit like ArrayList but does not preserve the order of its
 * entities, speedwise it is very good, especially suited for games.
 */
var bag = function (capacity) {
  var data = [];
  var pSize = 0;
  if (capacity) {
    data.length = capacity;
  } else {
    data.length = 64;
  }

  /**
   * Removes the element at the specified position in this Bag. does this by
   * overwriting it was last element then removing last element
   *
   * @param index
   *            the index of element to be removed
   * @return element that was removed from the Bag; undefined if index is equal or greater than the bag's size
   */
  var removeByIndex = function (index) {
    if (index >= pSize) {
      return undefined;
    }
    var tmp = data[index];
    data[index] = data[--pSize];
    data[pSize] = null;
    return tmp;
  };

  /**
   * Remove and return the last object in the bag.
   *
   * @return the last object in the bag, null if empty.
   */
  var removeLast = function () {
    if (pSize > 0) {
      var tmp = data[--pSize];
      data[pSize] = null;
      return tmp;
    }
    return null;
  };

  /**
   * Removes the first occurrence of the specified element from this Bag, if
   * it is present. If the Bag does not contain the element, it is unchanged.
   * does this by overwriting it was last element then removing last element
   *
   * @param e
   *            element to be removed from this list, if present
   * @return <tt>true</tt> if this list contained the specified element
   */
  var removeElement = function (e) {
    var tmp;
    for (var i = 0; i < pSize; i++) {
      tmp = data[i];
      if (e == tmp) {
        data[i] = data[--pSize];
        data[pSize] = null;
        return true;
      }
    }
    return false;
  };

  /**
   * Check if bag contains this element.
   *
   * @param e
   * @return
   */
  var contains = function (e) {
    for (var i = 0; i < pSize; i++) {
      if (e == data[i]) {
        return true;
      }
    }
    return false;
  };

  /**
   * Removes from this Bag all of its elements that are contained in the
   * specified Bag.
   *
   * @param removeBag
   *            Bag containing elements to be removed from this Bag
   * @return {@code true} if this Bag changed as a result of the call
   */
  var removeAll = function (removeBag) {
    var modified = false;
    var tmp;
    for (var i = 0; i < removeBag.size(); i++) {
      tmp = removeBag.get(i);
      for (var j = 0; j < pSize; j++) {
        if (tmp == data[j]) {
          removeByIndex(j);
          j--;
          modified = true;
          break;
        }
      }
    }

    return modified;
  };

  /**
   * Returns the element at the specified position in Bag.
   *
   * @param index
   *            index of the element to return
   * @return the element at the specified position in bag
   */
  var get = function (index) {
    return data[index];
  };

  /**
   * Returns the number of elements in this bag.
   *
   * @return the number of elements in this bag
   */
  var size = function () {
    return pSize;
  };

  /**
   * Returns the number of elements the bag can hold without growing.
   *
   * @return the number of elements the bag can hold without growing.
   */
  var getCapacity = function () {
    return data.length;
  };

  /**
   * Checks if the internal storage supports this index.
   *
   * @param index
   * @return
   */
  var isIndexWithinBounds = function (index) {
    return index < getCapacity();
  };

  /**
   * Returns true if this list contains no elements.
   *
   * @return true if this list contains no elements
   */
  var isEmpty = function () {
    return pSize === 0;
  };

  /**
   * Adds the specified element to the end of this bag. if needed also
   * increases the capacity of the bag.
   *
   * @param e
   *            element to be added to this list
   */
  var add = function (e) {
    if (pSize === data.length) {
      grow();
    }
    data[pSize++] = e;
  };

  /**
   * Set element at specified index in the bag.
   *
   * @param index position of element
   * @param e the element
   */
  var set = function (index, e) {
    if (index >= data.length) {
      grow(index * 2);
    }
    if (index > pSize) {
      pSize = index + 1;
    }
    data[index] = e;
  };

  function grow(newCapacity) {
    if (!newCapacity) {
      newCapacity = Math.ceil((data.length * 3) / 2 + 1);
    }
    data.length = newCapacity;
  }

  /**
   * Removes all of the elements from this bag. The bag will be empty after
   * this call returns.
   */
  var clear = function () {
    for (var i = 0; i < data.length; i++) {
      data[i] = null;
    }
    pSize = 0;
  };

  /**
   * Add all items into this bag.
   * @param items a bag of items to add
   */
  var addAll = function (items) {
    for (var i = 0; i < items.size(); i++) {
      add(items.get(i));
    }
  };

  return {
    add: add,
    addAll: addAll,
    removeByIndex: removeByIndex,
    removeLast: removeLast,
    removeElement: removeElement,
    removeAll: removeAll,
    clear: clear,
    get: get,
    set: set,
    getCapacity: getCapacity,
    size: size,
    contains: contains,
    isIndexWithinBounds: isIndexWithinBounds,
    isEmpty: isEmpty
  };
};

/**
 * Bitset implementation based on https://github.com/inexplicable/bitset
 */
function bitSet() {
  var BITS_OF_A_WORD = 32,
    SHIFTS_OF_A_WORD = 5;

  var _words = [];

  var whichWord = function (pos) {
    return pos >> SHIFTS_OF_A_WORD;
  };
  var mask = function (pos) {
    return 1 << (pos & 31);
  };

  var getWords = function () {
    return _words;
  };
  var set = function (pos) {
    if (pos < 0) {
      return;
    }
    var which = whichWord(pos);
    _words[which] = _words[which] | mask(pos);
    return _words[which];
  };
  var clear = function (pos) {
    if (pos < 0) {
      return;
    }
    var which = whichWord(pos);
    _words[which] = _words[which] & ~mask(pos);
    return _words[which];
  };
  var get = function (pos) {
    if (pos < 0) {
      return undefined;
    }
    var which = whichWord(pos);
    return _words[which] & mask(pos);
  };
  var maxWords = function () {
    return _words.length;
  };
  var cardinality = function () {
    var next, sum = 0;
    for (next = 0; next < _words.length; next += 1) {
      var nextWord = _words[next] || 0;
      //this loops only the number of set bits, not 32 constant all the time!
      for (var bits = nextWord; bits !== 0; bits &= (bits - 1)) {
        sum += 1;
      }
    }
    return sum;
  };
  var or = function (set) {
    if (this === set) {
      return this;
    }

    var next, commons = Math.min(maxWords(), set.maxWords());
    var setWords = set.getWords();
    for (next = 0; next < commons; next += 1) {
      _words[next] = (_words[next] || 0) | (setWords[next] || 0);
    }
    if (commons < set.maxWords()) {
      _words = _words.concat(setWords.slice(commons, set.maxWords()));
    }
    return this;
  };
  var and = function (set) {
    if (this === set) {
      return this;
    }

    var next,
      commons = Math.min(maxWords(), set.maxWords());
    var setWords = set.getWords();
    for (next = 0; next < commons; next += 1) {
      _words[next] = (_words[next] || 0) & (setWords[next] || 0);
    }
    if (commons > set.maxWords()) {
      var length = Math.max(Math.ceil((set.maxWords() - commons)), 0);
      var idx = 0;
      var range = new Array(length);
      while (idx < length) {
        range[idx++] = commons;
        commons += 1;
      }
      for (var i = 0; i < range.length; i++) {
        _words.pop();
      }
    }
    return this;
  };
  var xor = function (set) {
    var next, commons = Math.min(maxWords(), set.maxWords());
    var setWords = set.getWords();
    for (next = 0; next < commons; next += 1) {
      _words[next] = (_words[next] || 0) ^ (setWords[next] || 0);
    }

    var mw;
    if (commons < set.maxWords()) {
      mw = set.maxWords();
      for (next = commons; next < mw; next += 1) {
        _words[next] = (setWords[next] || 0) ^ 0;
      }
    } else {
      mw = maxWords();
      for (next = commons; next < mw; next += 1) {
        _words[next] = (_words[next] || 0) ^ 0;
      }
    }
    return this;
  };
  var nextSetBit = function (pos) {
    var next = whichWord(pos);
    //beyond max words
    if (next >= _words.length) {
      return -1;
    }
    //the very first word
    var firstWord = _words[next],
      mw = maxWords(),
      bit;
    if (firstWord) {
      for (bit = pos & 31; bit < BITS_OF_A_WORD; bit += 1) {
        if ((firstWord & mask(bit))) {
          return (next << SHIFTS_OF_A_WORD) + bit;
        }
      }
    }
    for (next = next + 1; next < mw; next += 1) {
      var nextWord = _words[next];
      if (nextWord) {
        for (bit = 0; bit < BITS_OF_A_WORD; bit += 1) {
          if ((nextWord & mask(bit)) !== 0) {
            return (next << SHIFTS_OF_A_WORD) + bit;
          }
        }
      }
    }
    return -1;
  };
  var prevSetBit = function (pos) {
    var prev = whichWord(pos);
    //beyond max words
    if (prev >= _words.length) {
      return -1;
    }
    //the very last word
    var lastWord = _words[prev],
      bit;
    if (lastWord) {
      for (bit = pos & 31; bit >= 0; bit -= 1) {
        if ((lastWord & mask(bit))) {
          return (prev << SHIFTS_OF_A_WORD) + bit;
        }
      }
    }
    for (prev = prev - 1; prev >= 0; prev -= 1) {
      var prevWord = _words[prev];
      if (prevWord) {
        for (bit = BITS_OF_A_WORD - 1; bit >= 0; bit -= 1) {
          if ((prevWord & mask(bit)) !== 0) {
            return (prev << SHIFTS_OF_A_WORD) + bit;
          }
        }
      }
    }
    return -1;
  };
  var toString = function (radix) {
    radix = radix || 10;
    var tmp = [];
    for (var i = 0; i < _words.length; i++) {
      tmp.push((_words[i] || 0).toString(radix));
    }
    return '[' + tmp.join(', ') + ']';
  };
  var intersects = function (set) {
    for (var i = Math.min(maxWords(), set.maxWords()) - 1; i >= 0; i--) {
      if (_words[i] & set.getWords()[i]) {
        return true;
      }
    }
    return false;
  };
  var isEmpty = function () {
    return _words.length === 0;
  };

  return {
    getWords: getWords,
    set: set,
    get: get,
    clear: clear,
    maxWords: maxWords,
    cardinality: cardinality,
    or: or,
    and: and,
    xor: xor,
    nextSetBit: nextSetBit,
    prevSetBit: prevSetBit,
    intersects: intersects,
    isEmpty: isEmpty,
    toString: toString
  };
}

if (!Math.signum) {
	Math.signum = function (x) {
		return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
	};
}

var FastMath = {
	_sin_a: -4 / this.SQUARED_PI,
	_sin_b: 4 / Math.PI,
	_sin_p: 9 / 40,
	_asin_a: -0.0481295276831013447,
	_asin_b: -0.343835993947915197,
	_asin_c: 0.962761848425913169,
	_asin_d: 1.00138940860107040,

	SQUARED_PI: Math.PI * Math.PI,
	HALF_PI: Math.PI * 0.5,
	TWO_PI: Math.PI * 2,
	THREE_PI_HALVES: this.TWO_PI - this.HALF_PI,
	cos: function (x) {
		return this.sin(x + ((x > this.HALF_PI) ? -this.THREE_PI_HALVES : this.HALF_PI));
	},
	sin: function (x) {
		x = this._sin_a * x * Math.abs(x) + this._sin_b * x;
		return this._sin_p * (x * Math.abs(x) - x) + x;
	},
	tan: function (x) {
		return sin(x) / cos(x);
	},
	asin: function (x) {
		return x * (Math.abs(x) * (Math.abs(x) * this._asin_a + this._asin_b) + this._asin_c) + 
			Math.signum(x) * (this._asin_d - Math.sqrt(1 - x * x));
	},
	acos: function (x) {
		return this.HALF_PI - this.asin(x);
	},
	atan: function (x) {
		return (Math.abs(x) < 1) ? x / (1 + this._atan_a * x * x) : Math.signum(x) * this.HALF_PI - x / (x * x + this._atan_a);
	}
};

var timer = {
  _delay: 0,
  _repeat: false,
  _acc: 0,
  _done: false,
  _stopped: false,
  execute: null,
  create: function (delay, repeat, executeFunction) {
    var self = Object.create(this);
    self._delay = delay;
    if (typeof repeat === "boolean") {
      self._repeat = repeat;
    }
    self.execute = executeFunction;
    return self;
  },
  update: function update(delta) {
    if (!this._done && !this._stopped) {
      this._acc += delta;

      if (this._acc >= this._delay) {
        this._acc -= this._delay;

        if (this._repeat) {
          this.reset();
        } else {
          this._done = true;
        }

        if (typeof this.execute === "function") {
          this.execute();
        }
      }
    }
  },
  reset: function reset() {
    this._stopped = false;
    this._done = false;
    this._acc = 0;
  },
  isDone: function isDone() {
    return this._done;
  },
  isRunning: function isRunning() {
    return !this._done && this._acc < this._delay && !this._stopped;
  },
  stop: function stop() {
    this._stopped = true;
  },
  setDelay: function setDelay(delay) {
    this._delay = delay;
  },
  getPercentageRemaining: function getPercentageRemaining() {
    if (this._done)
      return 100;
    else if (this._stopped)
      return 0;
    else
      return 1 - (this._delay - this._acc) / this._delay;
  },
  getDelay: function getDelay() {
    return this._delay;
  }
};

function uuid() {
  var uuid4 = "", i, random;
  for (i = 0; i < 32; i++) {
    random = Math.random() * 16 | 0;

    if (i == 8 || i == 12 || i == 16 || i == 20) {
      uuid4 += "-";
    }
    uuid4 += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
  }
  return uuid4;
}

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

/**
 * base prototype to be extended
 * @type {prototype|*}
 */
var base = Object.create(Object.prototype);

/**
 * Extend this object with one or more objects.
 * Copy all property to extending object (concatenation)
 * If private members are needed, use blueprint/closure
 */
Object.defineProperty(base, "extend", {
  value: function () {
    var hasOwnProperty = Object.hasOwnProperty;
    var object = Object.create(this);
    var length = arguments.length;
    var index = length;

    while (index) {
      var extension = arguments[length - (index--)];

      for (var property in extension) {
        if (hasOwnProperty.call(extension, property) || typeof object[property] === "undefined") {
          object[property] = extension[property];
        }
      }
    }

    return object;
  },
  configurable: false,
  enumerable: false,
  writable: true
});

/**
 * A tag class. All components in the system must extend this class.
 * Extended components are required to set a different componentType for each component type
 */
var component = base.extend({
  create: function () {
    return Object.create(this);
  }
});

Object.defineProperty(component, "componentType", {
  value: "component",
  configurable: true,
  enumerable: false,
  writable: false
});

var componentManager = (function () {
  var componentManagerClosure = function () {
    var componentsByType = bag();
    var deleted = bag();

    function removeComponentsOfEntity(entity) {
      var componentBits = entity.getComponentBits();
      for (var i = componentBits.nextSetBit(0); i >= 0; i = componentBits.nextSetBit(i + 1)) {
        componentsByType.get(i).set(entity.getId(), null);
      }
      componentBits.clear();
    }

    this.addComponent = function addComponent(entity, componentType, component) {
      var components = this.getComponentsByType(componentType);
      components.set(entity.getId(), component);
      entity.getComponentBits().set(componentType.getIndex());
    };

    this.removeComponent = function removeComponent(entity, componentType) {
      var componentBits = entity.getComponentBits();
      if (componentBits.get(componentType.getIndex())) {
        componentsByType.get(componentType.getIndex()).set(entity.getId(), null);
        componentBits.clear(componentType.getIndex());
      }
    };

    this.getComponentsByType = function getComponentsByType(componentType) {
      var components = componentsByType.get(componentType.getIndex());
      if (!components) {
        components = bag();
        componentsByType.set(componentType.getIndex(), components);
      }
      return components;
    };

    this.getComponent = function getComponent(entity, componentType) {
      var components = componentsByType.get(componentType.getIndex());
      if (components) {
        return components.get(entity.getId());
      }
      return null;
    };

    this.getComponentsFor = function getComponentsFor(entity, fillBag) {
      var componentBits = entity.getComponentBits();

      for (var i = componentBits.nextSetBit(0); i >= 0; i = componentBits.nextSetBit(i + 1)) {
        fillBag.add(componentsByType.get(i).get(entity.getId()));
      }

      return fillBag;
    };

    this.deleted = function deletedFunc(entity) {
      deleted.add(entity);
    };

    this.clean = function clean() {
      if (deleted.size() > 0) {
        for (var i = 0; deleted.size() > i; i++) {
          removeComponentsOfEntity(deleted.get(i));
        }
        deleted.clear();
      }
    };
  };

  var componentManager = ExtendHelper.extendManager(manager, "componentManager", {
    create: function () {
      var self = Object.create(this);
      componentManagerClosure.call(self);
      return self;
    }
  });
  return componentManager;
})();

var ComponentMapper = (function () {
  var closure = function (componentType, world) {
    var type = ComponentType.getTypeFor(componentType);
    var components = world.getComponentManager().getComponentsByType(type);

    /**
     * Fast but unsafe retrieval of a component for this entity.
     * No bounding checks, so this could return undefined,
     * however in most scenarios you already know the entity possesses this component.
     *
     * @param e the entity that should possess the component
     * @return the instance of the component
     */
    this.get = function (e) {
      return components.get(e.getId());
    };

    /**
     * Fast and safe retrieval of a component for this entity.
     * If the entity does not have this component then null is returned.
     *
     * @param e the entity that should possess the component
     * @return the instance of the component
     */
    this.getSafe = function (e) {
      if (components.isIndexWithinBounds(e.getId())) {
        return components.get(e.getId());
      }
      return null;
    };

    /**
     * Checks if the entity has this type of component.
     * @param e the entity to check
     * @return true if the entity has this component type, false if it doesn't.
     */
    this.has = function (e) {
      return components.isIndexWithinBounds(e.getId());
    };
  };

  return {
    /**
     * Returns a component mapper for this type of components.
     *
     * @param componentType the type of components this mapper uses.
     * @param world the world that this component mapper should use.
     * @return a new mapper.
     */
    getFor: function (componentType, world) {
      var componentMapper = {};
      closure.call(componentMapper, componentType, world);
      return componentMapper;
    }
  };
})();

var ComponentType = (function () {
  var INDEX = 0;
  var componentTypes = Object.create(null);

  function createComponentType() {
    var index = INDEX++;

    return {
      getIndex: function () {
        return index;
      }
    };
  }

  return {
    getTypeFor: function (componentType) {
      var type = componentTypes[componentType];
      if (!type) {
        type = createComponentType();
        componentTypes[componentType] = type;
      }
      return type;
    },
    getIndexFor: function (componentType) {
      return this.getTypeFor(componentType).getIndex();
    }
  };
})();


/**
 * The entity class. Cannot be instantiated outside the framework, you must
 * create new entities using World.
 *
 */
var entity = (function () {
  var entityClosure = function (world, id) {
    var pUuid;
    var componentBits = bitSet();
    var systemBits = bitSet();
    var entityManager = world.getEntityManager();
    var componentManager = world.getComponentManager();

    /**
     * Make entity ready for re-use.
     * Will generate a new uuid for the entity.
     */
    this.reset = function reset() {
      componentBits.clear();
      systemBits.clear();
      pUuid = uuid();
    };

    /**
     * The internal id for this entity within the framework. No other entity
     * will have the same ID, but ID's are however reused so another entity may
     * acquire this ID if the previous entity was deleted.
     *
     * @return id of the entity.
     */
    this.getId = function getId() {
      return id;
    };

    /**
     * Returns a BitSet instance containing bits of the components the entity possesses.
     * @return
     */
    this.getComponentBits = function getComponentBits() {
      return componentBits;
    };

    /**
     * Returns a BitSet instance containing bits of the components the entity possesses.
     * @return
     */
    this.getSystemBits = function getSystemBits() {
      return systemBits;
    };

    /**
     * Get the UUID for this entity.
     * This UUID is unique per entity (re-used entities get a new UUID).
     * @return uuid instance for this entity.
     */
    this.getUuid = function getUuid() {
      return pUuid;
    };

    /**
     * Returns the world this entity belongs to.
     * @return world of entity.
     */
    this.getWorld = function getWorld() {
      return world;
    };

    /**
     * Add a component to this entity.
     * Faster with componentType passed in as argument. Not necessarily to use this, but
     * in some cases you might need the extra performance.
     *
     * @param component to add to this entity
     * @param componentType of the component
     *
     * @return this entity for chaining.
     */
    this.addComponent = function addComponent(component, componentType) {
      var type = componentType;
      if (!type) {
        type = ComponentType.getTypeFor(component.componentType);
      }
      componentManager.addComponent(this, type, component);
      return this;
    };

    /**
     * Removes the component from this entity.
     *
     * @param component to remove from this entity.
     *
     * @return this entity for chaining.
     */
    this.removeComponent = function removeComponent(component) {
      return this.removeComponentByType(component.componentType);
    };

    /**
     * Remove component by its type.
     * Faster removal of components from a entity if componentType is a ComponentType object
     *
     * @param componentType a component type string or ComponentType object
     *
     * @return this entity for chaining.
     */
    this.removeComponentByType = function removeComponentByType(componentType) {
      var type = componentType;
      if (typeof type === "string") {
        type = ComponentType.getTypeFor(type);
      }
      componentManager.removeComponent(this, type);
      return this;
    };

    /**
     * Checks if the entity has been added to the world and has not been deleted from it.
     * If the entity has been disabled this will still return true.
     *
     * @return true if it's active; false otherwise
     */
    this.isActive = function isActive() {
      return entityManager.isActive(id);
    };

    /**
     * Will check if the entity is enabled in the world.
     * By default all entities that are added to world are enabled,
     * this will only return false if an entity has been explicitly disabled.
     *
     * @return true if it's enabled; false otherwise
     */
    this.isEnabled = function isEnabled() {
      return entityManager.isEnabled(id);
    };

    /**
     * Retrieving a component from an entity.
     * But the recommended way to retrieve components from an entity is using
     * the ComponentMapper.
     *
     * @param componentType
     *            in order to retrieve the component fast you must provide a
     *            ComponentType instance for the expected component.
     *            Slower if provided component type string
     * @return component that matches, or null if none is found.
     */
    this.getComponent = function getComponent(componentType) {
      var type = componentType;
      if (typeof type === "string") {
        type = ComponentType.getTypeFor(type);
      }
      return componentManager.getComponent(this, type);
    };

    /**
     * Returns a bag of all components this entity has.
     * You need to reset the bag yourself if you intend to fill it more than once.
     *
     * @param fillBag the bag to put the components into.
     * @return the fillBag with the components in.
     */
    this.getComponents = function getComponents(fillBag) {
      return componentManager.getComponentsFor(this, fillBag);
    };

    /**
     * Refresh all changes to components for this entity. After adding or
     * removing components, you must call this method. It will update all
     * relevant systems. It is typical to call this after adding components to a
     * newly created entity.
     */
    this.addToWorld = function addToWorld() {
      world.addEntity(this);
    };

    /**
     * This entity has changed, a component added or deleted.
     */
    this.changedInWorld = function changedInWorld() {
      world.changedEntity(this);
    };

    /**
     * Delete this entity from the world.
     */
    this.deleteFromWorld = function deleteFromWorld() {
      world.deleteEntity(this);
    };

    /**
     * (Re)enable the entity in the world, after it having being disabled.
     * Won't do anything unless it was already disabled.
     */
    this.enable = function enable() {
      world.enable(this);
    };

    /**
     * Disable the entity from being processed. Won't delete it, it will
     * continue to exist but won't get processed.
     */
    this.disable = function disable() {
      world.disable(this);
    };
  };

  var entity = {
    create: function (world, id) {
      var self = Object.create(this);
      entityClosure.call(self, world, id);
      self.reset();
      return self;
    }
  };

  return entity;
})();

var entityManager = (function () {
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
      var e = entity.create(this.getWorld(), idPool.checkOut());
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

  var entityManager = ExtendHelper.extendManager(manager, "entityManager", {
    create: function () {
      var self = Object.create(this);
      entityManagerClosure.call(self);
      return self;
    }
  });
  return entityManager;
})();

var entityObserver = base.extend({
  added: function (e) {
  },
  changed: function (e) {
  },
  deleted: function (e) {
  },
  enabled: function (e) {
  },
  disabled: function (e) {
  }
});


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

  var entitySystem = ExtendHelper.extendSystem(base, "entitySystem", entityObserver, {
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

var ExtendHelper = (function () {
  function extend(base, typeInfo) {
    var extensions = Array.prototype.slice.call(arguments, 2);
    var extended = base.extend.apply(base, extensions);
    Object.defineProperty(extended, typeInfo.name, {
      value: typeInfo.value,
      configurable: true,
      enumerable: false,
      writable: false
    });
    return extended;
  }

  return {
    extendSystem: function (baseSystem, newSystemType, extensions) {
      var args = [];
      args.length = arguments.length;
      args[0] = arguments[0];
      args[1] = {
        name: "systemType",
        value: newSystemType
      };
      for (var i = 2; i < arguments.length; i++) {
        args.push(arguments[i]);
      }
      return extend.apply(null, args);
    },
    extendManager: function (baseManager, newManagerType, extensions) {
      var args = [];
      args.length = arguments.length;
      args[0] = arguments[0];
      args[1] = {
        name: "managerType",
        value: newManagerType
      };
      for (var i = 2; i < arguments.length; i++) {
        args.push(arguments[i]);
      }
      return extend.apply(null, arguments);
    },
    extendComponent: function (baseComponent, newComponentType, extensions) {
      var args = [];
      args.length = arguments.length;
      var start = 2;
      if (typeof baseComponent === "string") {
        args[0] = d8.component;
        args[1] = {
          name: "componentType",
          value: baseComponent
        };
        start = 1;
      } else {
        args[0] = baseComponent;
        args[1] = {
          name: "componentType",
          value: newComponentType
        };
      }
      for (var i = start; i < arguments.length; i++) {
        if (arguments[i]) {
          args.push(arguments[i]);
        }
      }
      return extend.apply(null, args);
    }
  };
})();

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

/**
 * The primary instance for the framework. It contains all the managers.
 *
 * You must use this to create, delete and retrieve entities.
 *
 * It is also important to set the delta each game loop iteration, and initialize before game loop.
 *
 * @author Arni Arent
 *
 */
var world = (function () {
  var worldClosure = function () {
    var entityManager = entityManager.create();
    var componentManager = componentManager.create();

    var delta = 0;
    var added = bag();
    var changed = bag();
    var deleted = bag();
    var enable = bag();
    var disable = bag();

    var managers = Object.create(null);
    var managersBag = bag();

    var systems = Object.create(null);
    var systemsBag = bag();

    function setComponentMapper(system, world) {
      if (system.__componentTypes) {
        var requestedTypes = system.__componentTypes;
        if (typeof requestedTypes === "string") {
          requestedTypes = [requestedTypes];
        }
        if (!Array.isArray(requestedTypes) || requestedTypes.length === 0) {
          return;
        }
        var requestedType;
        for (var i = 0; i < requestedTypes.length; i++) {
          requestedType = requestedTypes[i];
          var componentMapper = world.getMapper(requestedType);
          Object.defineProperty(system, requestedType + "Mapper", {
            value: componentMapper,
            configurable: false,
            enumerable: true,
            writable: false
          });
        }
      }
    }

    /**
     * Makes sure all managers systems are initialized in the order they were added.
     */
    this.initialize = function initialize() {
      var manager;
      for (var i = 0; i < managersBag.size(); i++) {
        manager = managersBag.get(i);
        manager.initialize.call(manager);
      }

      var system;
      for (i = 0; i < systemsBag.size(); i++) {
        system = systemsBag.get(i);
        setComponentMapper(system, this);
        system.initialize.call(system);
      }
    };

    /**
     * Returns a manager that takes care of all the entities in the world.
     * entities of this world.
     *
     * @return entity manager.
     */
    this.getEntityManager = function getEntityManager() {
      return entityManager;
    };

    /**
     * Returns a manager that takes care of all the components in the world.
     *
     * @return component manager.
     */
    this.getComponentManager = function getComponentManager() {
      return componentManager;
    };

    /**
     * Add a manager into this world. It can be retrieved later.
     * World will notify this manager of changes to entity.
     *
     * @param manager to be added
     */
    this.setManager = function setManager(manager) {
      managers[manager.managerType] = manager;
      managersBag.add(manager);
      manager.setWorld(this);
      return manager;
    };

    /**
     * Returns a manager of the specified type.
     *
     * @param managerType
     *            class type of the manager
     * @return the manager
     */
    this.getManager = function getManager(managerType) {
      return managers[managerType];
    };

    /**
     * Deletes the manager from this world.
     * @param manager to delete.
     */
    this.deleteManager = function deleteManager(manager) {
      delete managers[manager.managerType];
      managersBag.removeElement(manager);
    };

    /**
     * Time since last game loop.
     *
     * @return delta time since last game loop.
     */
    this.getDelta = function getDelta() {
      return delta;
    };

    /**
     * You must specify the delta for the game here.
     *
     * @param dt time since last game loop.
     */
    this.setDelta = function setDelta(dt) {
      delta = dt;
    };

    /**
     * Adds a entity to this world.
     *
     * @param entity
     */
    this.addEntity = function addEntity(entity) {
      added.add(entity);
    };

    /**
     * Ensure all systems are notified of changes to this entity.
     * If you're adding a component to an entity after it's been
     * added to the world, then you need to invoke this method.
     *
     * @param entity
     */
    this.changedEntity = function changedEntity(entity) {
      changed.add(entity);
    };

    /**
     * Delete the entity from the world.
     *
     * @param entity
     */
    this.deleteEntity = function deleteEntity(entity) {
      if (!deleted.contains(entity)) {
        deleted.add(entity);
      }
    };

    /**
     * (Re)enable the entity in the world, after it having being disabled.
     * Won't do anything unless it was already disabled.
     */
    this.enable = function enableFunc(entity) {
      enable.add(entity);
    };

    /**
     * Disable the entity from being processed. Won't delete it, it will
     * continue to exist but won't get processed.
     */
    this.disable = function disableFunc(entity) {
      disable.add(entity);
    };

    /**
     * Create and return a new or reused entity instance.
     * Will NOT add the entity to the world, use World.addEntity(Entity) for that.
     *
     * @return entity
     */
    this.createEntity = function createEntity() {
      return entityManager.createEntityInstance();
    };

    /**
     * Get a entity having the specified id.
     *
     * @param entityId
     * @return entity
     */
    this.getEntity = function getEntity(entityId) {
      return entityManager.getEntity(entityId);
    };

    /**
     * Gives you all the systems in this world for possible iteration.
     *
     * @return all entity systems in world.
     */
    this.getSystems = function getSystems() {
      return systemsBag;
    };

    /**
     * Adds a system to this world that will be processed by World.process()
     *
     * @param system the system to add.
     * @param passive whether or not this system will be processed by World.process()
     * @return the added system.
     */
    this.setSystem = function setSystem(system, passive) {
      system.setWorld(this);
      system.setPassive(passive);

      systems[system.systemType] = system;
      systemsBag.add(system);

      return system;
    };

    /**
     * Removed the specified system from the world.
     * @param system to be deleted from world.
     */
    this.deleteSystem = function deleteSystem(system) {
      delete systems[system.systemType];
      systemsBag.removeElement(system);
    };

    /**
     * Retrieve a system for specified system type.
     *
     * @param systemType type of system.
     * @return instance of the system in this world.
     */
    this.getSystem = function getSystem(systemType) {
      return systems[systemType];
    };

    /**
     * Retrieves a ComponentMapper instance for fast retrieval of components from entities.
     *
     * @param type of component to get mapper for.
     * @return mapper for specified component type.
     */
    this.getMapper = function getMapper(componentType) {
      return ComponentMapper.getFor(componentType, this);
    };

    function notify(bag, entity, action) {
      var tmp;
      for (var i = 0; i < bag.size(); i++) {
        tmp = bag.get(i);
        if (tmp[action]) {
          tmp[action].call(tmp, entity);
        }
      }
    }

    /**
     * Performs an action on each entity.
     * @param entities
     * @param action
     */
    function check(entities, action) {
      if (!entities.isEmpty()) {
        var entity;
        for (var i = 0; i < entities.size(); i++) {
          entity = entities.get(i);
          notify(managersBag, entity, action);
          notify(systemsBag, entity, action);
        }
        entities.clear();
      }
    }

    /**
     * Process all non-passive systems.
     */
    this.process = function process() {
      check(added, "added");
      check(changed, "changed");
      check(disable, "disabled");
      check(enable, "enabled");
      check(deleted, "deleted");

      componentManager.clean();

      var system;
      for (var i = 0; i < systemsBag.size(); i++) {
        system = systemsBag.get(i);
        if (!system.isPassive()) {
          system.process.call(system);
        }
      }
    };

    this.setManager(entityManager);
    this.setManager(componentManager);
  };

  var world = base.extend({
    create: function () {
      var self = Object.create(this);
      worldClosure.call(self);
      return self;
    }
  });

  return world;
})();

/**
 * The purpose of this class is to allow systems to execute at varying intervals.
 *
 * An example system would be an ExpirationSystem, that deletes entities after a certain
 * lifetime. Instead of running a system that decrements a timeLeft value for each
 * entity, you can simply use this system to execute in a future at a time of the shortest
 * lived entity, and then reset the system to run at a time in a future at a time of the
 * shortest lived entity, etc.
 *
 * Another example system would be an AnimationSystem. You know when you have to animate
 * a certain entity, e.g. in 300 milliseconds. So you can set the system to run in 300 ms.
 * to perform the animation.
 *
 * This will save CPU cycles in some scenarios.
 *
 * Implementation notes:
 * In order to start the system you need to override the inserted(Entity e) method,
 * look up the delay time from that entity and offer it to the system by using the
 * offerDelay(float delay) method.
 * Also, when processing the entities you must also call offerDelay(float delay)
 * for all valid entities.
 *
 */
var delayedEntityProcessingSystem = (function () {
  var delayedEntityProcessingClosure = function () {
    var delay = 0;
    var running = false;
    var acc = 0;

    /**
     * Start processing of entities after a certain amount of delta time.
     *
     * Cancels current delayed run and starts a new one.
     *
     * @param delta time delay until processing starts.
     */
    this.restart = function restart(delta) {
      delay = delta;
      acc = 0;
      running = true;
    };

    /**
     * Restarts the system only if the delay offered is shorter than the
     * time that the system is currently scheduled to execute at.
     *
     * If the system is already stopped (not running) then the offered
     * delay will be used to restart the system with no matter its value.
     *
     * If the system is already counting down, and the offered delay is
     * larger than the time remaining, the system will ignore it. If the
     * offered delay is shorter than the time remaining, the system will
     * restart itself to run at the offered delay.
     *
     * @param delay
     */
    this.offerDelay = function offerDelay(delay) {
      if (!running || delay < this.getRemainingTimeUntilProcessing()) {
        this.restart(delay);
      }
    };

    /**
     * Get the time until the system is scheduled to run at.
     * Returns zero (0) if the system is not running.
     * Use isRunning() before checking this value.
     *
     * @return time when system will run at.
     */
    this.getRemainingTimeUntilProcessing = function getRemainingTimeUntilProcessing() {
      if (running) {
        return delay - acc;
      }
      return 0;
    };

    /**
     * Stops the system from running, aborts current countdown.
     * Call offerDelay or restart to run it again.
     */
    this.stop = function stop() {
      running = false;
      acc = 0;
    };

    this.inserted = function inserted(entity) {
      var delay = this.getRemainingDelay(entity);
      if (delay > 0) {
        this.offerDelay(delay);
      }
    };

    /**
     * Get the initial delay that the system was ordered to process entities after.
     *
     * @return the originally set delay.
     */
    this.getInitialTimeDelay = function getInitialTimeDelay() {
      return delay;
    };

    /**
     * Check if the system is counting down towards processing.
     *
     * @return true if it's counting down, false if it's not running.
     */
    this.isRunning = function isRunning() {
      return running;
    };

    this.processEntities = function processEntities(entities) {
      var entity, remaining;
      for (var i = 0; i < entities.size(); i++) {
        entity = entities.get(i);
        this.processDelta(entity, acc);
        remaining = this.getRemainingDelay(entity);
        if (remaining <= 0) {
          this.processExpired(entity);
        } else {
          this.offerDelay(remaining);
        }
      }
      acc = 0;
      if (entities.size() === 0) {
        this.stop();
      }
    };

    this.checkProcessing = function checkProcessing() {
      if (running) {
        acc += this.getWorld().getDelta();

        if (acc >= delay) {
          return true;
        }
      }
      return false;
    };
  };

  var delayedEntityProcessingSystem = ExtendHelper.extendSystem(entitySystem, "delayedEntityProcessingSystem", {
    create: function (aspect) {
      var self = entitySystem.create.call(this, aspect);
      delayedEntityProcessingClosure.call(self);
      return self;
    },
    /**
     * Return the delay until this entity should be processed.
     *
     * @param entity entity
     * @return delay
     */
    getRemainingDelay: function getRemainingDelay(entity) {
      throw {"NotImplemented": "Not supported yet. Override getRemainingDelay when extending"};
    },
    /**
     * Process a entity this system is interested in. Substract the accumulatedDelta
     * from the entities defined delay.
     *
     * @param entity the entity to process.
     * @param accumulatedDelta the delta time since this system was last executed.
     */
    processDelta: function processDelta(entity, accumulatedDelta) {
      throw {"NotImplemented": "Not supported yet. Override processDelta when extending"};
    },
    processExpired: function processExpired(entity) {
      throw {"NotImplemented": "Not supported yet. Override processExpired when extending"};
    }
  });
  return delayedEntityProcessingSystem;
})();

/**
 * A typical entity system. Use this when you need to process entities possessing the
 * provided component types.
 *
 */
var entityProcessingSystem = ExtendHelper.extendSystem(entitySystem, "entityProcessingSystem", {
  create: function (aspect) {
    var self = entitySystem.create.call(this, aspect);
    return self;
  },
  /**
   * Process a entity this system is interested in.
   * @param entity the entity to process.
   */
  processEntity: function process(entity) {
    throw ({"NotImplemented": "Not supported yet. Override process when extending"});
  },
  processEntities: function processEntities(entities) {
    for (var i = 0; i < entities.size(); i++) {
      this.processEntity(entities.get(i));
    }
  },
  checkProcessing: function checkProcessing() {
    return true;
  }
});

/**
 * If you need to process entities at a certain interval then use this.
 * A typical usage would be to regenerate ammo or health at certain intervals, no need
 * to do that every game loop, but perhaps every 100 ms. or every second.
 *
 */
var intervalEntityProcessingSystem = ExtendHelper.extendSystem(entityProcessingSystem, "intervalEntityProcessingSystem", {
  create: function (aspect, interval) {
    var self = entityProcessingSystem.create.call(this, aspect);
    self = intervalEntitySystem.create.call(self, aspect, interval);
    return self;
  }
});

/**
 * A system that processes entities at a interval in milliseconds.
 * A typical usage would be a collision system or physics system.
 *
 */
var intervalEntitySystem = (function () {
  var intervalEntitySystemClosure = function (interval) {
    var acc = 0;

    this.checkProcessing = function checkProcessing() {
      acc += this.getWorld().getDelta();
      if (acc >= interval) {
        acc -= interval;
        return true;
      }
      return false;
    };
  };

  var intervalEntitySystem = ExtendHelper.extendSystem(entitySystem, "intervalEntitySystem", {
    create: function (aspect, interval) {
      var self = entitySystem.create.call(this, aspect);
      intervalEntitySystemClosure.call(self, interval);
      return self;
    }
  });
  return intervalEntitySystem;
})();

/**
 * This system has an empty aspect so it processes no entities, but it still gets invoked.
 * You can use this system if you need to execute some game logic and not have to concern
 * yourself about aspects or entities.
 *
 */
var voidEntitySystem = ExtendHelper.extendSystem(entitySystem, "voidEntitySystem", {
  create: function () {
    var self = entitySystem.create.call(this, Aspect.getEmpty());
    return self;
  },
  processSystem: function processSystem() {
    throw ({"NotImplemented": "Not supported yet. Override processSystem when extending"});
  },
  processEntities: function processEntities() {
    this.processSystem.call(this);
  },

  checkProcessing: function () {
    return true;
  }
});

/**
 * If you need to group your entities together, e.g. tanks going into "units" group or explosions into "effects",
 * then use this manager. You must retrieve it using world instance.
 *
 * A entity can be assigned to more than one group.
 *
 */
var groupManager = (function () {
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

  var groupManager = ExtendHelper.extendManager(manager, "groupManager", {
    create: function () {
      var self = Object.create(this);
      groupManagerClosure.call(self);
      return self;
    }
  });
  return groupManager;
})();

/**
 * You may sometimes want to specify to which player an entity belongs to.
 *
 * An entity can only belong to a single player at a time.
 *
 */
var playerManager = (function () {
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

  var playerManager = ExtendHelper.extendManager(manager, "playerManager", {
    create: function () {
      var self = Object.create(this);
      playerManagerClosure.call(self);
      return self;
    }
  });
  return playerManager;
})();


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
      if (removedTag !== null) {
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

/**
 * Use this class together with PlayerManager.
 *
 * You may sometimes want to create teams in your game, so that
 * some players are team mates.
 *
 * A player can only belong to a single team.
 *
 */
var teamManager = (function () {
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
      if (!players) {
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
      if (!team) {
        var players = playersByTeam[team];
        if (!players) {
          players.removeElement(player);
        }
      }
    }

    this.removeFromTeam = removeFromTeam;
  };

  var teamManager = ExtendHelper.extendManager(manager, "managerType", {
    create: function () {
      var self = Object.create(this);
      teamManagerClosure.call(self);
      return self;
    }
  });
  return teamManager;
})();