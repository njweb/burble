import burble from '../src'

describe('burble', () => {
  it('should work', () => {

    const obj = {
      a: 20,
      b: 32,
      c: 'abc',
      d: () => true,
      e: { value: 123 }
    };

    const func = slice => {
      if(typeof slice[1] === 'function') {
        slice[1](func);
      } else console.log('Slice', slice)
    };

    expect(
      burble(obj)(func)
    ).toBe(obj);

  });
});