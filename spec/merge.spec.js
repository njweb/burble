import {burble} from '../src'

describe('merge', () => {
  it('should combine a second pipe at a specific step in the first pipe', () => {
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