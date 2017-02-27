import {burble, map, filter, scan, merge, pump} from '../src'

describe('burble', () => {
  it('should work', () => {
    let pipe = burble().map((num) => num * 2).make();

    let inputs = [5, 8, 20], outputs = [];
    pipe.out((num) => outputs.push(num));
    inputs.forEach(i => pipe(i));

    expect(outputs).toEqual(inputs.map(num => num * 2));
  });
});

describe('burble - filter', () => {
  it('should work', () => {
    let pipe = burble().filter(msg => msg % 2 === 0).make();

    let inputs = [1, 2, 5, 4, 27, 16], outputs = [];
    pipe.out((msg) => outputs.push(msg));
    inputs.forEach(num => pipe(num));

    expect(outputs).toEqual([2, 4, 16]);
  });
});

describe('burble - scan', () => {
  it('should work', () => {
    let stream = burble().scan((acc, num) => acc + num, 0).make();

    let inputs = [1, 3, 4], outputs = [];
    stream.out(v => outputs.push(v));
    inputs.forEach(v => stream(v));

    expect(outputs).toEqual([1, 4, 8]);
  })
});

describe('burble - merge', () => {
  it('should work', () => {
    let inputsA = [2, 5, 6], inputsB = [1, 4, 11], outputs = [];

    let streamB = burble().make();
    let streamA = burble()
      .map(num => -num)
      .merge(streamB)
      .map(num => num * 2)
      .make();

    streamA.out(msg => outputs.push(msg));
    inputsA.forEach(v => streamA(v));
    inputsB.forEach(v => streamB(v));

    expect(outputs).toEqual([-4, -10, -12, 2, 8, 22]);
  })
});

describe('burble - pump', () => {
  it('should work', () => {
    let counter = 0;
    let pipe = burble()
      .map(num => num + 1)
      .pump((num, inject) => {
        while (counter < 3) inject(num + counter++);
        counter = 0;
      })
      .map(num => -num)
      .make();

    let inputs = [4, 10], outputs = [];

    pipe.out(msg => outputs.push(msg));
    inputs.forEach(num => pipe(num));

    expect(outputs).toEqual([-5, -6, -7, -11, -12, -13]);
  });
  it('should work with promises', () => {
    const createSimplePromise = (value, timespan) => {
      return new Promise(res => { setTimeout(() => res(value), timespan) });
    };
    return new Promise(res => {
      let pipe = burble()
        .pump((msg, inject) => {
          msg.then(result => inject(result));
        })
        .make();

        let inputs = [
          createSimplePromise({value: 'abc'}, 10),
          createSimplePromise({value: 'def'}, 4),
          createSimplePromise({value: 'hig'}, 5)
        ], outputs = [];

        pipe.out(msg => {
          outputs.push(msg);
          if(outputs.length === inputs.length) res(outputs);
        });
        inputs.forEach(i => pipe(i));
    }).then(outputs => {
      expect(outputs).toEqual([{value: 'def'}, {value: 'hig'}, {value: 'abc'}]);
    });
  });
});