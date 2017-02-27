import {burble} from '../src'

describe('take', () => {
  it('should return a promise that resolves after a set number of messages have been received', () => {
    let pipe = burble().make();

    let inputs = [1, 2, 3];
    let promise = pipe.take(3).then((values) => {
      expect(values).toEqual(inputs);
    });
    inputs.forEach(num => pipe(num));
    return promise;
  });
});