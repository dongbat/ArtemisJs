/**
 * Bitset implementation based on https://github.com/inexplicable/bitset
 */
function bitSet() {
  var BITS_OF_A_WORD = 32,
    SHIFTS_OF_A_WORD = 5;

  var _words = [];

  var whichWord = function (pos) {
    return pos >> SHIFTS_OF_A_WORD;
  };
  var mask = function (pos) {
    return 1 << (pos & 31);
  };

  var getWords = function () {
    return _words;
  };
  var set = function (pos) {
    if (pos < 0) {
      return;
    }
    var which = whichWord(pos);
    return _words[which] = _words[which] | mask(pos);
  };
  var clear = function (pos) {
    if (pos < 0) {
      return;
    }
    var which = whichWord(pos);
    return _words[which] = _words[which] & ~mask(pos);
  };
  var get = function (pos) {
    if (pos < 0) {
      return undefined;
    }
    var which = whichWord(pos);
    return _words[which] & mask(pos);
  };
  var maxWords = function () {
    return _words.length;
  };
  var cardinality = function () {
    var next, sum = 0;
    for (next = 0; next < _words.length; next += 1) {
      var nextWord = _words[next] || 0;
      //this loops only the number of set bits, not 32 constant all the time!
      for (var bits = nextWord; bits !== 0; bits &= (bits - 1)) {
        sum += 1;
      }
    }
    return sum;
  };
  var or = function (set) {
    if (this === set) {
      return this;
    }

    var next, commons = Math.min(maxWords(), set.maxWords());
    var setWords = set.getWords();
    for (next = 0; next < commons; next += 1) {
      _words[next] = (_words[next] || 0) | (setWords[next] || 0);
    }
    if (commons < set.maxWords()) {
      _words = _words.concat(setWords.slice(commons, set.maxWords()));
    }
    return this;
  };
  var and = function (set) {
    if (this === set) {
      return this;
    }

    var next,
      commons = Math.min(maxWords(), set.maxWords());
    var setWords = set.getWords();
    for (next = 0; next < commons; next += 1) {
      _words[next] = (_words[next] || 0) & (setWords[next] || 0);
    }
    if (commons > set.maxWords()) {
      var length = Math.max(Math.ceil((set.maxWords() - commons)), 0);
      var idx = 0;
      var range = new Array(length);
      while (idx < length) {
        range[idx++] = commons;
        commons += 1;
      }
      for (var i = 0; i < range.length; i++) {
        _words.pop();
      }
    }
    return this;
  };
  var xor = function (set) {
    var next, commons = Math.min(maxWords(), set.maxWords());
    var setWords = set.getWords();
    for (next = 0; next < commons; next += 1) {
      _words[next] = (_words[next] || 0) ^ (setWords[next] || 0);
    }

    if (commons < set.maxWords()) {
      var mw = set.maxWords();
      for (next = commons; next < mw; next += 1) {
        _words[next] = (setWords[next] || 0) ^ 0;
      }
    } else {
      var mw = maxWords();
      for (next = commons; next < mw; next += 1) {
        _words[next] = (_words[next] || 0) ^ 0;
      }
    }
    return this;
  };
  var nextSetBit = function (pos) {
    var next = whichWord(pos);
    //beyond max words
    if (next >= _words.length) {
      return -1;
    }
    //the very first word
    var firstWord = _words[next],
      mw = maxWords(),
      bit;
    if (firstWord) {
      for (bit = pos & 31; bit < BITS_OF_A_WORD; bit += 1) {
        if ((firstWord & mask(bit))) {
          return (next << SHIFTS_OF_A_WORD) + bit;
        }
      }
    }
    for (next = next + 1; next < mw; next += 1) {
      var nextWord = _words[next];
      if (nextWord) {
        for (bit = 0; bit < BITS_OF_A_WORD; bit += 1) {
          if ((nextWord & mask(bit)) !== 0) {
            return (next << SHIFTS_OF_A_WORD) + bit;
          }
        }
      }
    }
    return -1;
  };
  var prevSetBit = function (pos) {
    var prev = whichWord(pos);
    //beyond max words
    if (prev >= _words.length) {
      return -1;
    }
    //the very last word
    var lastWord = _words[prev],
      bit;
    if (lastWord) {
      for (bit = pos & 31; bit >= 0; bit -= 1) {
        if ((lastWord & mask(bit))) {
          return (prev << SHIFTS_OF_A_WORD) + bit;
        }
      }
    }
    for (prev = prev - 1; prev >= 0; prev -= 1) {
      var prevWord = _words[prev];
      if (prevWord) {
        for (bit = BITS_OF_A_WORD - 1; bit >= 0; bit -= 1) {
          if ((prevWord & mask(bit)) !== 0) {
            return (prev << SHIFTS_OF_A_WORD) + bit;
          }
        }
      }
    }
    return -1;
  };
  var toString = function (radix) {
    radix = radix || 10;
    var tmp = [];
    for (var i = 0; i < _words.length; i++) {
      tmp.push((_words[i] || 0).toString(radix));
    }
    return '[' + tmp.join(', ') + ']';
  };
  var intersects = function (set) {
    for (var i = Math.min(maxWords(), set.maxWords()) - 1; i >= 0; i--) {
      if (_words[i] & set.getWords()[i]) {
        return true;
      }
    }
    return false;
  };
  var isEmpty = function () {
    return _words.length === 0;
  };

  return {
    getWords: getWords,
    set: set,
    get: get,
    clear: clear,
    maxWords: maxWords,
    cardinality: cardinality,
    or: or,
    and: and,
    xor: xor,
    nextSetBit: nextSetBit,
    prevSetBit: prevSetBit,
    intersects: intersects,
    isEmpty: isEmpty,
    toString: toString
  };
}