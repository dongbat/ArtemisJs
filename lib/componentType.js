d8.ComponentType = (function () {
  var INDEX = 0;
  var componentTypes = Object.create(null);

  function createComponentType() {
    var index = INDEX++;

    return {
      getIndex: function () {
        return index;
      }
    }
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
