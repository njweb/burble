"use strict";

const path = require('path');
const mockFn = jest.fn();
import burble from '../src'
import {parseFile} from '../src'
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

const nameLength = (user) => {
  if (user.hasOwnProperty('friendlyName')) return user.friendlyName.length;
  else return user.firstName.length + user.lastName.length + 1;
};

describe('burble', () => {
  return burble({
    examples: ['a', 'b'],
    iterator: factoryToGenerator(() => faker.random.alphaNumeric(1))(),
    filename: path.resolve(__dirname, './examples.json') + '@things'
  })('should work', (item) => {
    console.log('TEST: ', item);
    expect(item.length < 4).toBe(true);
  });
  // it('should work', () => {
  //   console.log("PATH -> ", path.resolve(__dirname, './examples.json'));
  //   // return parseFile(path.resolve(__dirname, './examples.json') + '@things');
  //   return parseFile(path.resolve(__dirname, './examples.json') + '@things');
  // });

  // burble({
  //   examples: [userFactory(), userFactory()],
  //   iterator: factoryToGenerator(userFactory)()
  // })('should work', (userValue) => {
  //   expect(nameLength(userValue) > 0).toBe(true);
  // });


});