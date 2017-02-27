import {burble} from '../src'

describe('scan', () => {
  it('should, for each message, reapply the accumulator value along with the message to the predicate', () => {
    let stream = burble().scan((acc, num) => acc + num, 0).make();

    let inputs = [1, 3, 4], outputs = [];
    stream.out(v => outputs.push(v));
    inputs.forEach(v => stream(v));

    expect(outputs).toEqual([1, 4, 8]);
  })
});