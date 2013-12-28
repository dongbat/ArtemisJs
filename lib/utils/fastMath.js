if (!Math.signum) {
	Math.signum = function (x) {
		return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
	};
}

var FastMath = {
	_sin_a: -4 / this.SQUARED_PI,
	_sin_b: 4 / Math.PI,
	_sin_p: 9 / 40,
	_asin_a: -0.0481295276831013447,
	_asin_b: -0.343835993947915197,
	_asin_c: 0.962761848425913169,
	_asin_d: 1.00138940860107040,

	SQUARED_PI: Math.PI * Math.PI,
	HALF_PI: Math.PI * 0.5,
	TWO_PI: Math.PI * 2,
	THREE_PI_HALVES: this.TWO_PI - this.HALF_PI,
	cos: function (x) {
		return this.sin(x + ((x > this.HALF_PI) ? -this.THREE_PI_HALVES : this.HALF_PI));
	},
	sin: function (x) {
		x = this._sin_a * x * Math.abs(x) + this._sin_b * x;
		return this._sin_p * (x * Math.abs(x) - x) + x;
	},
	tan: function (x) {
		return sin(x) / cos(x);
	},
	asin: function (x) {
		return x * (Math.abs(x) * (Math.abs(x) * this._asin_a + this._asin_b) + this._asin_c) + 
			Math.signum(x) * (this._asin_d - Math.sqrt(1 - x * x));
	},
	acos: function (x) {
		return this.HALF_PI - this.asin(x);
	},
	atan: function (x) {
		return (Math.abs(x) < 1) ? x / (1 + this._atan_a * x * x) : Math.signum(x) * this.HALF_PI - x / (x * x + this._atan_a);
	}
};