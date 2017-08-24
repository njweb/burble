"use strict";

const path = require('path');
const mockFn = jest.fn();
import burble from '../src'
import {parseFile} from '../src'
import {pFetchRecord} from '../src/fileRecords';
import faker from 'faker'

const maybe = (valueA, valueB, probability = 0.5) => {
  if (Math.random() > probability) return valueB;
  else return valueA;
};

const probably = (valueA, valueB, probability = 0.9) => {
  if (Math.random() > probability) return valueB;
  else return valueA;
};

const factoryToGenerator = function (factory) {
  return function*() {
    while (true) {
      yield factory();
    }
  }
};

const userFactory = () => {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    friendlyName: maybe(faker.name.firstName(), '')
  }
};

const charFactory = () => {
  let chars = 'abcd'.split('');
  // chars = chars.concat([1, 2]);
  return chars[Math.floor(Math.random() * chars.length)];
};

const nameLength = (user) => {
  if (user.hasOwnProperty('friendlyName')) return user.friendlyName.length;
  else return user.firstName.length + user.lastName.length + 1;
};


describe('burble', () => {
  it('should work', () => {
    return pFetchRecord(__dirname + 'examples.json', 'myThings').then(result => {
      expect(result.exists).toBe(true);
    });
  });
});

// describe('burble', () => {
//   it('should work', () => {
//     return new Promise(res => {
//       setTimeout(() => {
//         res(5);
//       }, 200);
//     }).then(v => expect(v).toBe(4));
//   });
//   // return burble({
//   //   // examples: ['a', 'b'],
//   //   // iterator: factoryToGenerator(() => faker.random.alphaNumeric(1))(),
//   //   filename: path.resolve(__dirname, './examples.json') + '@things'
//   // })('should work', (item) => {
//   //   console.log('TEST: ', item);
//   //   expect(item.length < 2).toBe(true);
//   // });
// });