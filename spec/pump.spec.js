import {burble} from '../src'

describe('burble - pump', () => {
  it('should be able to create new messages in the pipe', () => {
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
  it('should be able to create messages asynchronously with promises', () => {
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