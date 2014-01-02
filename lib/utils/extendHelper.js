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
      return extend.apply(null, args);
    },
    extendComponent: function (baseComponent, newComponentType, extensions) {
      var args = [];
      args.length = arguments.length;
      args[0] = baseComponent;
      args[1] = {
        name: "componentType",
        value: newComponentType
      };
      for (var i = 2; i < arguments.length; i++) {
        if (arguments[i]) {
          args.push(arguments[i]);
        }
      }
      return extend.apply(null, args);
    }
  };
})();