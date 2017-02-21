import {burble, map, filter, scan, merge, pump} from '../src'

describe('burble', () => {
  it('should work', () => {
    let stream = burble().attach(map((num) => num * 2)).seal();

    let inputs = [5, 8, 20], outputs = [];
    stream.take((msg) => outputs.push(msg));
    inputs.forEach(num => stream.give(num));

    expect(outputs).toEqual(inputs.map(num => num * 2));
  });
});

describe('burble - filter', () => {
  it('should work', () => {

    let stream = burble().attach(filter(msg => msg % 2 === 0)).seal();

    let inputs = [1, 2, 5, 4, 27, 16], outputs = [];
    stream.take((msg) => outputs.push(msg));
    inputs.forEach(num => stream.give(num));

    expect(outputs).toEqual([2, 4, 16]);
  });
});

describe('burble - scan', () => {
  it('should work', () => {
    let stream = burble().attach(scan((acc, num) => acc + num, 0)).seal();

    let inputs = [1, 3, 4], outputs = [];
    stream.take(v => outputs.push(v));
    inputs.forEach(v => stream.give(v));

    expect(outputs).toEqual([1, 4, 8]);
  })
});

describe('burble - merge', () => {
  it('should work', () => {
    let inputsA = [2, 5, 6], inputsB = [1, 4, 11], outputs = [];


    let streamB = burble().seal();
    let streamA = burble()
      .attach(map(num => -num))
      .attach(merge(streamB))
      .attach(map(num => num * 2))
      .seal();

    streamA.take(msg => outputs.push(msg));
    inputsA.forEach(v => streamA.give(v));
    inputsB.forEach(v => streamB.give(v));

    expect(outputs).toEqual([-4, -10, -12, 2, 8, 22]);
  })
});

describe('burble - pump', () => {
  it('should work', () => {
    let counter = 0;
    let stream = burble()
      .attach(map(num => num + 1))
      .attach(pump((num, inject) => {
        while (counter < 3) inject(num + counter++);
        counter = 0;
      }))
      .attach(map(num => -num))
      .seal();

    let inputs = [4, 10], outputs = [];

    stream.take(msg => outputs.push(msg));
    inputs.forEach(num => stream.give(num));

    expect(outputs).toEqual([-5, -6, -7, -11, -12, -13]);
  });
  it('should work with promises', () => {
    const createSimplePromise = (value, timespan) => {
      return new Promise(res => { setTimeout(() => res(value), timespan) });
    };
    return new Promise(res => {
      let stream = burble()
        .attach(pump((msg, inject) => {
          msg.then(result => inject(result));
        }))
        .seal();

        let inputs = [
          createSimplePromise({value: 'abc'}, 10),
          createSimplePromise({value: 'def'}, 4),
          createSimplePromise({value: 'hig'}, 5)
        ], outputs = [];

        stream.take(msg => {
          outputs.push(msg);
          if(outputs.length === inputs.length) res(outputs);
        });
        inputs.forEach(i => stream.give(i));
    }).then(outputs => {
      expect(outputs).toEqual([{value: 'def'}, {value: 'hig'}, {value: 'abc'}]);
    });
  })
});