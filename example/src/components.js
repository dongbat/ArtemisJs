var ComponentTypes = {
  boundComponent: "boundComponent",
  colorAnimationComponent: "colorAnimationComponent",
  enemyComponent: "enemyComponent",
  expireComponent: "expireComponent",
  healthComponent: "healthComponent",
  parallaxStarComponent: "parallaxStarComponent",
  playerComponent: "playerComponent",
  positionComponent: "positionComponent",
  scaleAnimationComponent: "scaleAnimationComponent",
  spriteComponent: "spriteComponent",
  velocityComponent: "velocityComponent"
};

var Layers = {
  DEFAULT: 1,
  BACKGROUND: 2,
  ACTORS_1: 3,
  ACTORS_2: 4,
  ACTORS_3: 5,
  PARTICLES: 6
};

var boundComponent = artemis.ExtendHelper.extendComponent(artemis.component, ComponentTypes.boundComponent, {
  create: function (radius) {
    var self = Object.create(this);
    self.radius = radius;
    return self;
  }
});

var colorAnimationComponent = artemis.ExtendHelper.extendComponent(artemis.component, ComponentTypes.colorAnimationComponent, {
  create: function (red, green, blue, alpha, repeat) {
    var self = Object.create(this);
    self.red = red;
    self.green = green;
    self.blue = blue;
    self.alpha = alpha;
    self.repeat = repeat;
    return self;
  }
});

var enemyComponent = artemis.ExtendHelper.extendComponent(artemis.component, ComponentTypes.enemyComponent);

var expireComponent = artemis.ExtendHelper.extendComponent(artemis.component, ComponentTypes.expireComponent, {
  create: function (delay) {
    var self = Object.create(this);
    self.delay = delay;
    return self;
  }
});

var healthComponent = artemis.ExtendHelper.extendComponent(artemis.component, ComponentTypes.healthComponent, {
  create: function (health, maximumHealth) {
    var self = Object.create(this);
    self.health = health;
    self.maximumHealth = maximumHealth;
    return self;
  }
});

var parallaxStarComponent = artemis.ExtendHelper.extendComponent(artemis.component, ComponentTypes.parallaxStarComponent);

var playerComponent = artemis.ExtendHelper.extendComponent(artemis.component, ComponentTypes.playerComponent);

var positionComponent = artemis.ExtendHelper.extendComponent(artemis.component, ComponentTypes.positionComponent, {
  create: function (x, y) {
    var self = Object.create(this);
    self.x = x;
    self.y = y;
    return self;
  }
});

var scaleAnimationComponent = artemis.ExtendHelper.extendComponent(artemis.component, ComponentTypes.scaleAnimationComponent, {
  create: function (min, max, speed, repeat, active) {
    var self = Object.create(this);
    self.min = min;
    self.max = max;
    self.speed = speed;
    self.repeat = repeat;
    self.active = active;
    return self;
  }
});

var spriteComponent = artemis.ExtendHelper.extendComponent(artemis.component, ComponentTypes.spriteComponent, {
  create: function (name) {
    var self = Object.create(this);
    self.name = name;
    self.scale = {
      scaleX: 1,
      scaleY: 1
    };
    self.rotation = 0;
    self.color = {
      r: 1,
      g: 1,
      b: 1,
      a: 1
    };
    self.layer = Layers.DEFAULT;
    return self;
  }
});

var velocityComponent = (function () {
  var velocityComponent = artemis.component.extend({
    create: function (vectorX, vectorY) {
      var self = Object.create(this);
      self.vectorX = vectorX ? vectorX : 0;
      self.vectorY = vectorY ? vectorY : 0;
      return self;
    }
  });
  Object.defineProperty(velocityComponent, "componentType", {
    value: ComponentTypes.velocityComponent,
    configurable: true,
    enumerable: false,
    writable: false
  });
  return velocityComponent;
})();