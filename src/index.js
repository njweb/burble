const _flowThrough = (pipeline, msg, index) => {
  for (let len = pipeline.length; index < len; index += 1) {
    if (pipeline[index] !== undefined) {
      msg = pipeline[index](msg);
      if (msg === undefined) break;
    }
  }
  return msg;
};

const _broadcast = (msg, listeners) => {
  if (msg !== undefined) {
    let stripIndexes = [];
    listeners.forEach((listener, index) => {
      if (listener(msg) === false) stripIndexes.push(index);
    });
    if (stripIndexes.length > 0) {
      listeners = listeners.filter((listener, index) => {
        if (stripIndexes.length > 0 && stripIndexes[0] === index) {
          stripIndexes.shift();
          return false;
        } else return true;
      });
    }
  }
  return listeners;
};

const _makePipe = (pipeOperations) => {
  let _listeners = [];
  const inject = (msg, index) => {
    _listeners = _broadcast(_flowThrough(_pipeline, msg, index), _listeners);
  };
  const pipe = Object.defineProperties((msg) => { inject(msg, 0); }, {
    out: {
      value: (callback) => {
        _listeners.push(callback);
        return pipe;
      }
    },
    take: {
      value: (count) => {
        return new Promise(res => {
          const storage = [];
          _listeners.push((msg) => {
            if (storage.push(msg) >= count) {
              res(storage);
              return false;
            }
          })
        });
      }
    },
    _inject: {
      value: inject
    }
  });
  const _pipeline = pipeOperations.map((stage, index) => stage(pipe, index));
  return pipe;
};

const _pipeBuilder = () => {
  let _pipeOperations = [];
  let builder = {
    map: function map(predicate) {
      _pipeOperations.push(() => (msg) => predicate(msg));
      return builder;
    },
    filter: function filter(predicate) {
      _pipeOperations.push(() => (msg) => predicate(msg) === true ? msg : undefined);
      return builder;
    },
    scan: function scan(predicate, accumulator) {
      _pipeOperations.push(() => (msg) => {
        accumulator = predicate(accumulator, msg);
        return accumulator;
      });
      return builder;
    },
    merge: function merge(pipes) {
      if (!Array.isArray(pipes)) pipes = [pipes];
      _pipeOperations.push((pipe, index) => {
        index += 1;
        const _injector = msg => { pipe._inject(msg, index); };
        pipes.forEach(pipe => pipe.out(_injector));
      });
      return builder;
    },
    pump: function pump(predicate) {
      _pipeOperations.push((pipe, index) => {
        index += 1;
        const _injector = (msg) => { pipe._inject(msg, index); };
        return (msg) => predicate(msg, _injector);
      });
      return builder;
    },
    attach: function attach(operation) {
      _pipeOperations.push(operation);
      return builder;
    },
    make: function make() {
      return _makePipe(_pipeOperations);
    }
  };
  return builder;
};

export const burble = function burble() {
  return _pipeBuilder();
};