export const burble = function burble(pipes) {
  let _unboundPipes = [];
  const stream = Object.defineProperties({}, {
    give: {value: (msg) => { stream._inject(msg, 0); }, enumerable: true},
    take: {
      value: (modifier) => {
        if (typeof modifier === 'function') {
          stream._listeners.push(modifier);
          return modifier;
        }
      }, enumerable: true
    },
    _listeners: {value: [], writable: true},
    _complete: {
      value: (msg) => {
        stream._listeners.forEach(listener => {
          listener(msg);
        })
      }
    },
    _inject: {
      value: (msg, index) => {
        for (let i = index, len = stream._pipeline.length; i < len; i += 1) {
          if (msg !== undefined) {
            if(stream._pipeline[i] !== undefined) msg = stream._pipeline[i](msg);
          }
          else break;
        }
        if (msg !== undefined) stream._complete(msg);
      }
    }
  });
  const streamBuilder = {
    attach: (pipeOp) => {
      _unboundPipes.push(pipeOp);
      return streamBuilder;
    },
    seal: () => {
      Object.defineProperty(stream, '_pipeline', {
        value: _unboundPipes.map((pipeOp, index) => pipeOp(stream, index))
      });
      return stream;
    }
  };
  return streamBuilder;
};

export const map = function map(predicate) {
  return () => msg => predicate(msg);
};

export const filter = function filter(predicate) {
  return () => msg => predicate(msg) ? msg : undefined;
};

export const scan = function scan(predicate, accumulator) {
  return () => msg => accumulator = predicate(accumulator, msg);
};

export const merge = function merge(inputStream) {
  return (stream, index) => {
    inputStream.take((msg) => stream._inject(msg, index + 1));
  }
};

export const pump = function pump(predicate) {
  return (stream, index) => {
    let inject = msg => stream._inject(msg, index + 1);
    return msg => predicate(msg, inject);
  }
};