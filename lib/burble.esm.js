var burble = function burble(pipes) {
  var _unboundPipes = [];
  var stream = Object.defineProperties({}, {
    give: { value: function value(msg) {
        stream._inject(msg, 0);
      }, enumerable: true },
    take: {
      value: function value(modifier) {
        if (typeof modifier === 'function') {
          stream._listeners.push(modifier);
          return modifier;
        }
      }, enumerable: true
    },
    _listeners: { value: [], writable: true },
    _complete: {
      value: function value(msg) {
        stream._listeners.forEach(function (listener) {
          listener(msg);
        });
      }
    },
    _inject: {
      value: function value(msg, index) {
        for (var i = index, len = stream._pipeline.length; i < len; i += 1) {
          if (msg !== undefined) {
            if (stream._pipeline[i] !== undefined) msg = stream._pipeline[i](msg);
          } else break;
        }
        if (msg !== undefined) stream._complete(msg);
      }
    }
  });
  var streamBuilder = {
    attach: function attach(pipeOp) {
      _unboundPipes.push(pipeOp);
      return streamBuilder;
    },
    seal: function seal() {
      Object.defineProperty(stream, '_pipeline', {
        value: _unboundPipes.map(function (pipeOp, index) {
          return pipeOp(stream, index);
        })
      });
      return stream;
    }
  };
  return streamBuilder;
};

var map = function map(predicate) {
  return function () {
    return function (msg) {
      return predicate(msg);
    };
  };
};

var filter = function filter(predicate) {
  return function () {
    return function (msg) {
      return predicate(msg) ? msg : undefined;
    };
  };
};

var scan = function scan(predicate, accumulator) {
  return function () {
    return function (msg) {
      return accumulator = predicate(accumulator, msg);
    };
  };
};

var merge = function merge(inputStream) {
  return function (stream, index) {
    inputStream.take(function (msg) {
      return stream._inject(msg, index + 1);
    });
  };
};

var pump = function pump(predicate) {
  return function (stream, index) {
    var inject = function inject(msg) {
      return stream._inject(msg, index + 1);
    };
    return function (msg) {
      return predicate(msg, inject);
    };
  };
};

export { burble, map, filter, scan, merge, pump };
