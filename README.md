ArtemisJs
=========

A javascript port of [Artemis Entity System Framework](http://gamadu.com/artemis). It retains most of the Java version's API and should be able to run on both the client side (script tag or AMD) and server side (CommonJs).

***

##Differences with the original Java version

- delayedEntityProcessingSystem: will keep running until there's no more entity to process (all entities have timed out)
- bag: remove(int) -> removeByIndex
       remove(E) -> removeElement
- component/manager/system types are differentiated using a type property (`componentType`, `managerType` and `systemType` respectively) which need to be set using `Object.defineProperty`.

***

##How to use

###Setup

####Web

Simply use a script tag. This will add a variable `artemis` to the global space.

```
<script src="Artemis.js"></script>
```
or
```
<script src="Artemis.min.js"></script>
```

####AMD

RequireJs example:

```
require(["Artemis"], function(artemis) {
  // do something here
});
```

####CommonJs

For NodeJs, you can install from npm:
```
npm install artemisjs
```

###Create a world

```
var world = artemis.world.create();

world.setSystem(movementSystemInstance);

world.initialize();
```

###Define a component
Use the ExtendHelper to extend the default component or an another component. Component types are differentiated using `componentType` property (configurable but not enumerable/writable).

```
var positionComponent = artemis.ExtendHelper.extendComponent(artemis.component, "positionComponent", {
  create: function (x, y) {
    var self = Object.create(this);
    self.x = x;
    self.y = y;
    return self;
  }
});
```

If you don't want to use `ExtendHelper`, you will need to use `Object.defineProperty` to change `componentType`.

###Create an entity
An entity has to be created from the world instance.

```
var entity = world.createEntity();
entity.addComponent(positionComponent.create());
entity.addToWorld();
```

###Define an entity system

Similiarly to component, system types are differentiated using `systemType` property.

```
var movementSystem = artemis.ExtendHelper.extendSystem(artemis.entityProcessingSystem, "movementSystem", {
  __componentTypes: ["positionComponent", "velocityComponent"],
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
```

and to create a system:

```
var movementSystemInstance = movementSystem.create();
```

Component Mappers are injected into the system via `__componentTypes` property. This could be a string or an array of component type (which should be set when defining a component).
You can access these mappers with the convention: componentType + Mapper

***

##Running the example

The example is the spaceship warrior example port. It is written using [Cocos2d-html5](http://www.cocos2d-x.org/wiki/Cocos2d-html5) for rendering.

To run it, you will need the Cocos2d-html5 version. You can download the newest version [here](http://www.cocos2d-x.org/download). The newest version at the moment is v2.2.1.

Then simply copy the example folder into the Cocos2d-html5 folder and run `index.html` file. It should run with no problem on Firefox, you might need a server to run on other browser.

***

##Documentation

Visit the [wiki](https://github.com/dongbat/ArtemisJs/wiki) or [Artemis main page](http://gamadu.com/artemis/).

***

##License

The MIT License (MIT)

Copyright (c) 2013 dongbat <opensource@dongbat.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.