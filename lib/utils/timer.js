d8.timer = {
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