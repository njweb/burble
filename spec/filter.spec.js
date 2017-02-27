import {burble} from '../src'

describe('filter', () => {
  it('should remove messages from the pipe that the predicate does not resolve to true on', () => {
    let pipe = burble().filter(msg => msg % 2 === 0).make();

    let inputs = [1, 2, 5, 4, 27, 16], outputs = [];
    pipe.out((msg) => outputs.push(msg));
    inputs.forEach(num => pipe(num));

    expect(outputs).toEqual([2, 4, 16]);
  });
});