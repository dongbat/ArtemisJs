var SystemTypes = {
  collisionSystem: "collisionSystem",
  colorAnimationSystem: "colorAnimationSystem",
  entitySpawningTimerSystem: "entitySpawningTimerSystem",
  expiringSystem: "expiringSystem",
  healthRenderSystem: "healthRenderSystem",
  movementSystem: "movementSystem",
  parallaxStarRepeatingSystem: "parallaxStarRepeatingSystem",
  playerInputSystem: "playerInputSystem",
  removeOffScreenShipsSystem: "removeOffScreenShipsSystem",
  scaleAnimationSystem: "scaleAnimationSystem",
  spriteRendererSystem: "spriteRendererSystem"
};

var collisionSystem = (function () {
  var collisionPair = {
    groupEntitiesA: null,
    groupEntitiesB: null,
    handleCollision: null,
    positionComponentMapper: null,
    boundComponentMapper: null,
    create: function (world, group1, group2, positionComponentMapper, boundComponentMapper, handleCollision) {
      var self = Object.create(this);
      self.groupEntitiesA = world.getManager("groupManager").getEntities(group1);
      self.groupEntitiesB = world.getManager("groupManager").getEntities(group2);
      self.positionComponentMapper = positionComponentMapper;
      self.boundComponentMapper = boundComponentMapper;
      self.handleCollision = handleCollision;
      return self;
    },
    checkForCollisions: function () {
      var entityA, entityB;
      for (var a = 0; this.groupEntitiesA.size() > a; a++) {
        for (var b = 0; this.groupEntitiesB.size() > b; b++) {
          entityA = this.groupEntitiesA.get(a);
          entityB = this.groupEntitiesB.get(b);
          if (this.collisionExists(entityA, entityB) && typeof this.handleCollision === "function") {
            this.handleCollision(entityA, entityB);
          }
        }
      }
    },
    collisionExists: function (e1, e2) {
      var p1 = this.positionComponentMapper.get(e1);
      var p2 = this.positionComponentMapper.get(e2);

      var b1 = this.boundComponentMapper.get(e1);
      var b2 = this.boundComponentMapper.get(e2);

      var distanceSq = Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);

      return distanceSq < Math.pow(b2.radius + b1.radius, 2);
    }
  };

  var collisionSystemClosure = function () {
    var collisionPairs;

    this.initialize = function initialize() {
      collisionPairs = artemis.bag();
      var world = this.getWorld();
      var healthComponentMapper = this.healthComponentMapper;
      var cp = collisionPair.create(world, Groups.PLAYER_BULLETS, Groups.ENEMY_SHIPS,
        this.positionComponentMapper, this.boundComponentMapper, function (bullet, ship) {
          var bulletPosition = this.positionComponentMapper.get(bullet);
          EntityFactory.createExplosion(world, bulletPosition.x, bulletPosition.y, 0.1).addToWorld();
          for (var i = 0; i < 50; i++) {
            EntityFactory.createParticle(world, bulletPosition.x, bulletPosition.y).addToWorld();
          }
          bullet.deleteFromWorld();

          var health = healthComponentMapper.get(ship);
          var position = this.positionComponentMapper.get(ship);
          health.health -= 1;
          if (health.health <= 0) {
            health.health = 0;
            ship.deleteFromWorld();
            EntityFactory.createExplosion(world, position.x, position.y, 0.5).addToWorld();
          }
        });
      collisionPairs.add(cp);
    };

    this.processEntities = function processEntities() {
      var pair;
      for (var i = 0; i < collisionPairs.size(); i++) {
        pair = collisionPairs.get(i);
        pair.checkForCollisions.call(pair);
      }
    };
  };

  var collisionSystem = artemis.ExtendHelper.extendSystem(artemis.entitySystem, SystemTypes.collisionSystem, {
    __componentTypes: [ComponentTypes.positionComponent, ComponentTypes.boundComponent, ComponentTypes.healthComponent],
    create: function () {
      var aspect = artemis.Aspect.getAspectForAll(ComponentTypes.positionComponent, ComponentTypes.boundComponent);
      var self = artemis.entitySystem.create.call(this, aspect);
      collisionSystemClosure.call(self);
      return self;
    },
    initialize: function () {
    },
    checkProcessing: function checkProcessing() {
      return true;
    },
    processEntities: function processEntities() {
    }
  });

  return collisionSystem;
})();

var colorAnimationSystem = artemis.ExtendHelper.extendSystem(artemis.entityProcessingSystem, SystemTypes.colorAnimationSystem, {
  __componentTypes: [ComponentTypes.colorAnimationComponent, ComponentTypes.spriteComponent],
  create: function () {
    var aspect = artemis.Aspect.getAspectForAll.apply(null, this.__componentTypes);
    var self = artemis.entityProcessingSystem.create.call(this, aspect);
    return self;
  },
  processEntity: function process(entity) {
    var colorAnimation = this.colorAnimationComponentMapper.get(entity);
    var sprite = this.spriteComponentMapper.get(entity);
    var color = sprite.color;
    var alphaAnimation = colorAnimation.alpha;

    if (alphaAnimation && alphaAnimation.animate) {
      color.a += alphaAnimation.speed * this.getWorld().getDelta();

      if (color.a > alphaAnimation.max || color.a < alphaAnimation.min) {
        if (colorAnimation.repeat) {
          alphaAnimation.speed = -alphaAnimation.speed;
        } else {
          alphaAnimation.animate = false;
        }
      }
    }
  }
});

var entitySpawningTimerSystem = artemis.ExtendHelper.extendSystem(artemis.voidEntitySystem, SystemTypes.entitySpawningTimerSystem, {
  _timer1: null,
  _timer2: null,
  _timer3: null,
  size: null,
  create: function (size) {
    var self = artemis.voidEntitySystem.create.call(this);
    self.size = size;
    return self;
  },
  initialize: function initialize() {
    var world = this.getWorld();
    var size = this.size;

    this._timer1 = artemis.timer.create(2, true, function () {
      var x = randomRange(0, size.width);
      var y = size.height + 50;
      EntityFactory.createEnemyShip(world, "enemy1", Layers.ACTORS_3, 10, x, y, 0, -40, 10).addToWorld();
    });
    this._timer2 = artemis.timer.create(6, true, function () {
      var x = randomRange(0, size.width);
      var y = size.height + 100;
      EntityFactory.createEnemyShip(world, "enemy2", Layers.ACTORS_2, 20, x, y, 0, -30, 20).addToWorld();
    });
    this._timer3 = artemis.timer.create(12, true, function () {
      var x = randomRange(0, size.width);
      var y = size.height + 200;
      EntityFactory.createEnemyShip(world, "enemy3", Layers.ACTORS_1, 60, x, y, 0, -20, 35).addToWorld();
    });
  },
  processSystem: function processSystem() {
    this._timer1.update.call(this._timer1, this.getWorld().getDelta());
    this._timer2.update.call(this._timer2, this.getWorld().getDelta());
    this._timer3.update.call(this._timer3, this.getWorld().getDelta());
  }
});

var expiringSystem = artemis.ExtendHelper.extendSystem(artemis.delayedEntityProcessingSystem, SystemTypes.expiringSystem, {
  __componentTypes: [ComponentTypes.expireComponent],
  create: function () {
    var aspect = artemis.Aspect.getAspectForAll.apply(null, this.__componentTypes);
    var self = artemis.delayedEntityProcessingSystem.create.call(this, aspect);
    return self;
  },
  getRemainingDelay: function (entity) {
    var expires = this.expireComponentMapper.get(entity);
    return expires.delay;
  },
  processDelta: function (entity, accumulatedDelta) {
    var expires = this.expireComponentMapper.get(entity);
    expires.delay -= accumulatedDelta;
  },
  processExpired: function (entity) {
    entity.deleteFromWorld();
  }
});

var healthRenderSystem = (function () {
  var fontDef = {};
  fontDef.fontName = "Arial";
  fontDef.fontSize = 20;
  fontDef.fontAlignmentH = cc.TEXT_ALIGNMENT_CENTER;
  fontDef.fontAlignmentV = cc.VERTICAL_TEXT_ALIGNMENT_TOP;
  fontDef.fontFillColor = cc.c3b(255, 255, 255);

  var healthRendererSystemClosure = function (layer) {
    var labels = [];

    this.initialize = function initialize() {
      labels = [];
    };
    this.inserted = function inserted(entity) {
      var label = cc.LabelTTF.createWithFontDefinition("100%", fontDef);
      label.setScale(0.5);
      label.setAnchorPoint(cc.p(0, 1));
      layer.addChild(label, Layers.PARTICLES);
      labels[entity.getId()] = label;
    };

    this.removed = function removed(entity) {
      layer.removeChild(labels[entity.getId()]);
      labels[entity.getId()] = undefined;
    };
    this.processEntity = function processEntity(entity) {
      if (this.positionComponentMapper.has(entity)) {
        var position = this.positionComponentMapper.getSafe(entity);
        var healthComponent = this.healthComponentMapper.get(entity);

        var percentage = Math.round(healthComponent.health / healthComponent.maximumHealth * 100);
        var label = labels[entity.getId()];
        label.setPosition(position);
        label.setString(percentage + "%");
      }
    };
  };

  var healthRenderSystem = artemis.ExtendHelper.extendSystem(artemis.entityProcessingSystem, SystemTypes.healthRenderSystem, {
    __componentTypes: [ComponentTypes.positionComponent, ComponentTypes.healthComponent],
    create: function (layer) {
      var aspect = artemis.Aspect.getAspectForAll.apply(null, this.__componentTypes);
      var self = artemis.entityProcessingSystem.create.call(this, aspect);
      healthRendererSystemClosure.call(self, layer);
      return self;
    }
  });

  return healthRenderSystem;
})();

var movementSystem = artemis.ExtendHelper.extendSystem(artemis.entityProcessingSystem, SystemTypes.movementSystem, {
  __componentTypes: [ComponentTypes.positionComponent, ComponentTypes.velocityComponent],
  create: function () {
    var aspect = artemis.Aspect.getAspectForAll.apply(null, this.__componentTypes);
    var self = artemis.entityProcessingSystem.create.call(this, aspect);
    return self;
  },
  processEntity: function (e) {
    var position = this.positionComponentMapper.get(e);
    var velocity = this.velocityComponentMapper.get(e);

    position.x += velocity.vectorX * this.getWorld().getDelta();
    position.y += velocity.vectorY * this.getWorld().getDelta();
  }
});

var parallaxStarRepeatingSystem = (function () {
  var parallaxStarRepeatingSystem = artemis.intervalEntityProcessingSystem.extend({
    __componentTypes: [ComponentTypes.positionComponent, ComponentTypes.parallaxStarComponent],
    height: 0,
    create: function (size) {
      var aspect = artemis.Aspect.getAspectForAll.apply(null, this.__componentTypes);
      var self = artemis.intervalEntityProcessingSystem.create.call(this, aspect, 1);
      self.height = size.height;
      return self;
    },
    processEntity: function (e) {
      var position = this.positionComponentMapper.get(e);

      if (position.y < 0) {
        position.y = this.height;
      }
    }
  });
  Object.defineProperty(parallaxStarRepeatingSystem, "systemType", {
    value: SystemTypes.parallaxStarRepeatingSystem,
    configurable: true,
    enumerable: false,
    writable: false
  });
  return parallaxStarRepeatingSystem;
})();

var playerInputSystem = artemis.ExtendHelper.extendSystem(artemis.entityProcessingSystem, SystemTypes.playerInputSystem, {
  __componentTypes: [ComponentTypes.positionComponent, ComponentTypes.velocityComponent],
  _layer: null,
  _fireRate: 0.1,
  _timeToFire: 0,
  create: function (layer) {
    var aspect = artemis.Aspect.getAspectForAll(ComponentTypes.positionComponent,
      ComponentTypes.velocityComponent, ComponentTypes.playerComponent);
    var self = artemis.entityProcessingSystem.create.call(this, aspect);
    self._layer = layer;
    return self;
  },
  processEntity: function processEntity(entity) {
    var position = this.positionComponentMapper.get(entity);
    var layer = this._layer;
    var world = this.getWorld();

    if (layer.touchLocation) {
      position.x = layer.touchLocation.x;
      position.y = layer.touchLocation.y;
    }

    if (layer.isMouseDown) {
      if (this._timeToFire <= 0) {
        EntityFactory.createPlayerBullet(world, position.x - 13, position.y + 2).addToWorld();
        EntityFactory.createPlayerBullet(world, position.x + 13, position.y + 2).addToWorld();
        this._timeToFire = this._fireRate;
      }
    }
    if (this._timeToFire > 0) {
      this._timeToFire -= world.getDelta();
      if (this._timeToFire < 0) {
        this._timeToFire = 0;
      }
    }
  }
});

var removeOffScreenShipsSystem = artemis.ExtendHelper.extendSystem(artemis.intervalEntityProcessingSystem,
  SystemTypes.removeOffScreenShipsSystem, {
    __componentTypes: [ComponentTypes.positionComponent, ComponentTypes.boundComponent],
    create: function () {
      var aspect = artemis.Aspect.getAspectForAll(ComponentTypes.velocityComponent,
        ComponentTypes.positionComponent, ComponentTypes.healthComponent, ComponentTypes.boundComponent);
      aspect.exclude(ComponentTypes.playerComponent);
      var self = artemis.intervalEntityProcessingSystem.create.call(this, aspect, 5);
      return self;
    },
    processEntity: function processEntity(entity) {
      var position = this.positionComponentMapper.get(entity);
      var bound = this.boundComponentMapper.get(entity);

      if (position.y < -bound.radius) {
        entity.deleteFromWorld();
      }
    }
  });

var scaleAnimationSystem = artemis.ExtendHelper.extendSystem(artemis.entityProcessingSystem, SystemTypes.scaleAnimationSystem, {
  __componentTypes: [ComponentTypes.scaleAnimationComponent, ComponentTypes.spriteComponent],
  create: function () {
    var aspect = artemis.Aspect.getAspectForAll.apply(null, this.__componentTypes);
    var self = artemis.entityProcessingSystem.create.call(this, aspect);
    return self;
  },
  processEntity: function (entity) {
    var scaleAnimation = this.scaleAnimationComponentMapper.get(entity);

    if (scaleAnimation.active) {
      var sprite = this.spriteComponentMapper.get(entity);
      var scale = sprite.scale;
      scale.scaleX += scaleAnimation.speed * this.getWorld().getDelta();
      scale.scaleY = scale.scaleX;

      if (scale.scaleX > scaleAnimation.max) {
        scale.scaleX = scaleAnimation.max;
        scaleAnimation.active = false;
      } else if (scale.scaleX < scaleAnimation.min) {
        scale.scaleX = scaleAnimation.min;
        scaleAnimation.active = false;
      }
    }
  }
});

var spriteRendererSystem = (function () {
  var spriteRendererSystemClosure = function (layer) {
    var sprites;
    var entities;

    this.initialize = function initialize() {
      sprites = [];
      entities = artemis.bag();
    };
    this.inserted = function inserted(entity) {
      entities.add(entity);

      var spriteComponent = this.spriteComponentMapper.get(entity);
      var scale = spriteComponent.scale;

      var sprite = cc.Sprite.create(s_ResourceMapper[spriteComponent.name]);
      sprite.setAnchorPoint(cc.p(0.5, 0.5));
      sprite.setScale(scale.scaleX / 2, scale.scaleY / 2);
      layer.addChild(sprite, spriteComponent.layer);
      sprites[entity.getId()] = sprite;
    };

    this.removed = function removed(entity) {
      entities.removeElement(entity);
      layer.removeChild(sprites[entity.getId()]);
      sprites[entity.getId()] = undefined;
    };

    this.checkProcessing = function checkProcessing() {
      return true;
    };

    this.processEntities = function processEntities() {
      for (var i = 0; i < entities.size(); i++) {
        this.processEntity(entities.get(i));
      }
    };

    this.processEntity = function processEntity(entity) {
      if (this.positionComponentMapper.has(entity)) {
        var position = this.positionComponentMapper.getSafe(entity);
        var spriteComponent = this.spriteComponentMapper.get(entity);
        var color = spriteComponent.color;

        var sprite = sprites[entity.getId()];
        sprite.setPosition(position);
        sprite.setOpacity(color.a * 255);
        sprite.setColor(new cc.Color3B(color.r * 255, color.g * 255, color.b * 255));
      }
    };
  };

  var spriteRendererSystem = artemis.ExtendHelper.extendSystem(artemis.entitySystem, SystemTypes.spriteRendererSystem, {
    __componentTypes: [ComponentTypes.positionComponent, ComponentTypes.spriteComponent],

    create: function (layer) {
      var aspect = artemis.Aspect.getAspectForAll.apply(null, this.__componentTypes);
      var self = artemis.entitySystem.create.call(this, aspect);
      spriteRendererSystemClosure.call(self, layer);
      return self;
    }
  });
  return spriteRendererSystem;
})();