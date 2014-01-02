var Groups = {
  PLAYER_BULLETS: "player bullets",
  PLAYER_SHIP: "player ship",
  ENEMY_SHIPS: "enemy ships",
  ENEMY_BULLETS: "enemy bullets"
};

var EntityFactory = {
  createPlayer: function (world, x, y) {
    var player = world.createEntity();

    var position = positionComponent.create(x, y);
    player.addComponent(position);

    var sprite = spriteComponent.create("fighter");
    sprite.color = {
      r: 93 / 255,
      g: 255 / 255,
      b: 129 / 255,
      a: 1
    };
    sprite.layer = Layers.ACTORS_3;
    player.addComponent(sprite);

    var velocity = velocityComponent.create(0, 0);
    player.addComponent(velocity);

    var bounds = boundComponent.create(43);
    player.addComponent(bounds);

    player.addComponent(playerComponent.create());

    world.getManager("groupManager").add(player, Groups.PLAYER_SHIP);

    return player;
  },
  createPlayerBullet: function (world, x, y) {
    var e = world.createEntity();

    var position = positionComponent.create(x, y);
    e.addComponent(position);

    var sprite = spriteComponent.create("bullet");
    sprite.layer = Layers.PARTICLES;
    e.addComponent(sprite);

    var velocity = velocityComponent.create(0, 800);
    e.addComponent(velocity);

    var bounds = boundComponent.create(5);
    e.addComponent(bounds);

    var expires = expireComponent.create(5);
    e.addComponent(expires);

    world.getManager("groupManager").add(e, Groups.PLAYER_BULLETS);

    return e;
  },
  createEnemyShip: function (world, name, layer, health, x, y, velocityX, velocityY, boundsRadius) {
    var e = world.createEntity();

    var position = positionComponent.create(x, y);
    e.addComponent(position);

    var sprite = spriteComponent.create(name);
    sprite.color = {
      r: 255 / 255,
      g: 0 / 255,
      b: 142 / 255,
      a: 1
    };
    sprite.layer = layer;
    e.addComponent(sprite);

    var velocity = velocityComponent.create(velocityX, velocityY);
    e.addComponent(velocity);

    var bounds = boundComponent.create(boundsRadius);
    e.addComponent(bounds);

    var health = healthComponent.create(health, health);
    e.addComponent(health);

    world.getManager("groupManager").add(e, Groups.ENEMY_SHIPS);

    return e;
  },
  createExplosion: function (world, x, y, scale) {
    var e = world.createEntity();

    var position = positionComponent.create(x, y);
    e.addComponent(position);

    var sprite = spriteComponent.create("explosion");
    sprite.scale = {
      scaleX: scale,
      scaleY: scale
    };
    sprite.color = {
      r: 255 / 255,
      g: 216 / 255,
      b: 0,
      a: 0.5
    };
    sprite.layer = Layers.PARTICLES;
    e.addComponent(sprite);

    var expires = expireComponent.create(0.5);
    e.addComponent(expires);

    var scaleAnimation = scaleAnimationComponent.create(scale / 100, scale, 3, false, true);
    e.addComponent(scaleAnimation);

    return e;
  },
  createStar: function (world, size) {
    var star = world.createEntity();

    var position = positionComponent.create();
    position.x = randomRange(0, size.width);
    position.y = randomRange(0, size.height);
    star.addComponent(position);

    var sprite = spriteComponent.create("star");
    var scale = randomRange(0.5, 1);
    sprite.scale = {
      scaleX: scale,
      scaleY: scale
    };
    sprite.color = {
      r: 1,
      g: 1,
      b: 1,
      a: randomRange(0.1, 0.5)
    };
    sprite.layer = Layers.BACKGROUND;
    star.addComponent(sprite);

    var velocity = velocityComponent.create();
    velocity.vectorY = randomRange(-10, -60);
    star.addComponent(velocity);

    star.addComponent(parallaxStarComponent.create());

    var colorAnimation = colorAnimationComponent.create();
    colorAnimation.alpha = {
      min: 0.1,
      max: 0.5,
      speed: randomRange(0.2, 0.7),
      animate: true
    };
    colorAnimation.repeat = true;
    star.addComponent(colorAnimation);

    return star;
  },
  createParticle: function (world, x, y) {
    var e = world.createEntity();

    var position = positionComponent.create(x, y);
    e.addComponent(position);

    var sprite = spriteComponent.create("particle");
    var scale = randomRange(0.3, 0.6);
    sprite.scale = {
      scaleX: scale,
      scaleY: scale
    };
    sprite.color = {
      r: 1,
      g: 216 / 255,
      b: 0,
      a: 0.5
    };
    sprite.layer = Layers.PARTICLES;
    e.addComponent(sprite);

    var velocity = velocityComponent.create(randomRange(-400, 400), randomRange(-400, 400));
    e.addComponent(velocity);

    var expires = expireComponent.create(1);
    e.addComponent(expires);

    var colorAnimation = colorAnimationComponent.create();
    colorAnimation.alpha = {
      min: 0,
      max: 1,
      speed: -1,
      animate: true
    };
    colorAnimation.repeat = true;
    e.addComponent(colorAnimation);

    return e;
  }
};

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}