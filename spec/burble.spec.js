"use strict";

import burble from '../src'

describe('burble', () => {
  it('should work', () => {
    let b = burble(['a', 'b', 'c']);
    expect(typeof b.next).toBe('function');

    let output = [];
    for(let v of b){
      output.push(v);
    }
    expect(output[2]).toBe('c');
  });
});