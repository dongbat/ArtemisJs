/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var MyLayer = cc.Layer.extend({
  isMouseDown: false,
  touchLocation: null,
  world: null,
  spriteRendererSystem: null,
  healthRenderSystem: null,

  init: function () {

    //////////////////////////////
    // 1. super init first
    this._super();

    var winSize = cc.Director.getInstance().getWinSize();

    var world = artemis.world.create();

    world.setManager(artemis.groupManager.create());

    world.setSystem(movementSystem.create());
    world.setSystem(playerInputSystem.create(this));
    world.setSystem(collisionSystem.create());
    world.setSystem(expiringSystem.create());
    world.setSystem(entitySpawningTimerSystem.create(winSize));
    world.setSystem(parallaxStarRepeatingSystem.create(winSize));
    world.setSystem(colorAnimationSystem.create());
    world.setSystem(scaleAnimationSystem.create());
    world.setSystem(removeOffScreenShipsSystem.create());

    this.spriteRendererSystem = world.setSystem(spriteRendererSystem.create(this), true);
    this.healthRenderSystem = world.setSystem(healthRenderSystem.create(this), true);

    world.initialize();

    for (var i = 0; 100 > i; i++) {
      EntityFactory.createStar(world, winSize, i + 1).addToWorld();
    }
    EntityFactory.createPlayer(world, 200, 200).addToWorld();

    this.world = world;
    this.setTouchEnabled(true);
  },
  update: function (dt) {
    this.world.setDelta(dt);
    this.world.process();
    this.spriteRendererSystem.process.call(this.spriteRendererSystem);
    this.healthRenderSystem.process.call(this.healthRenderSystem);
  },
  onTouchesBegan: function (touches, event) {
    this.isMouseDown = true;
  },
  onTouchesMoved: function (touches, event) {
    if (touches) {
      var touch = touches[0];
      this.touchLocation = touch.getLocation();
    }
  },
  onTouchesEnded: function (touches, event) {
    this.isMouseDown = false;
  },
  onTouchesCancelled: function (touches, event) {
    console.log("onTouchesCancelled");
  }
});
var layer;
var MyScene = cc.Scene.extend({
  onEnter: function () {
    this._super();
    layer = new MyLayer();
    layer.scheduleUpdate();
    this.addChild(layer);
    layer.init();
  }
});