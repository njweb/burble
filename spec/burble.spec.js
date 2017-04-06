"use strict";

import burble from '../src'

describe('burble', () => {
  describe('approach', () => {


    // it('should generate', () => {
    //   let nestedGenerator = function*() {
    //     for (let arr of [[1, 2, 3], [5, 6, 7]]) {
    //       yield* arr;
    //     }
    //     // yield* [1, 2, 3];
    //     // yield* [5, 6, 7];
    //   };
    //
    //   return new Promise(res => {
    //     console.log('HERE');
    //     for (let v of nestedGenerator()) {
    //       expect(Number.isInteger(v)).toBe(true);
    //     }
    //     res();
    //   });
    // });
    // it('should work', () => {
    //   let p = Promise.resolve(5);
    //   return p.then(v => expect(v).toBe(5));
    // });

    // it('should work -> ', () => {
    //   return new Promise((res) => {
    //     setTimeout(() => res(5), 100);
    //   }).then(value => {
    //     it('right here ', () => {
    //       expect(value).toBe(6)
    //     });
    //   });
    // });

    describe('should work with ', () => {
      return new Promise(res => {
        burble(source => {
          for (let value of source()) {
            console.log('HERE', typeof value);
            it(`${value}`, () => {
              expect(typeof value).toBe('string');
            });
          }
        }, ['a', 'b', 'c', 1]);
        res();
      });
    });

  });
});