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
 * @author Arni Arent
 *
 */
d8.delayedEntityProcessingSystem = (function () {
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

  var delayedEntityProcessingSystem = d8.Helper.extendSystem(d8.entitySystem, "delayedEntityProcessingSystem", {
    create: function (aspect) {
      var self = d8.entitySystem.create.call(this, aspect);
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