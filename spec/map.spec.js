import {burble} from '../src'

describe('map', () => {
  it('should apply a transform to each message', () => {
    let pipe = burble().map((num) => num * 2).make();

    let inputs = [5, 8, 20], outputs = [];
    pipe.out((num) => outputs.push(num));
    inputs.forEach(i => pipe(i));

    expect(outputs).toEqual(inputs.map(num => num * 2));
  });
});