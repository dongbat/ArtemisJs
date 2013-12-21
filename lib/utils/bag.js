/**
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