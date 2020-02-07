import autoReducer from './autoReducer';

const testStateObject = {
  active: true,
  tags: ['green', 'happy'],
  attributes: [
    { type: 'level', data: 5 },
    { type: 'stacks', data: [32, 40, 101] },
    {
      type: 'characters',
      data: [
        { name: 'janice' },
        { name: 'george', status: 'missing' },
      ],
    },
  ],
};

describe('autoReducer', () => {
  describe('object transformation', () => {
    it('should return the input object if the transform does not change it', () => {
      const result = autoReducer(testStateObject, { type: 'set', path: ['tags', 1], value: 'happy' });

      expect(result === testStateObject).toBe(true);
    });

    it('should replace the root with an empty path array', () => {
      const result = autoReducer(testStateObject, {
        type: 'set',
        path: [],
        value: { title: 'replacement' },
      });

      expect(result).toEqual({ title: 'replacement' });
    });
    it('should replace the root with an missing path array', () => {
      const result = autoReducer(testStateObject, {
        type: 'set',
        value: { title: 'replacement' },
      });

      expect(result).toEqual({ title: 'replacement' });
    });
  });
  describe('set action type', () => {
    it('should be able to set a value in an object', () => {
      const result = autoReducer(testStateObject, {
        type: 'set',
        path: ['attributes', 2, 'data', 0, 'name'],
        value: 'madeline',
      });

      expect(result.attributes[2].data[0].name).toEqual('madeline');
    });

    it('should be able to add an attribute to an object', () => {
      const result = autoReducer(testStateObject, {
        type: 'set',
        path: ['attributes', 0, 'freq'],
        value: 0.25,
      });

      expect(result.attributes[0]).toEqual({ type: 'level', data: 5, freq: 0.25 });
    });

    it('should be able to add an attribute to an object at a key', () => {
      const result = autoReducer(testStateObject, {
        type: 'set',
        path: ['attributes', 0],
        key: 'freq',
        value: 0.25,
      });

      expect(result.attributes[0]).toEqual({ type: 'level', data: 5, freq: 0.25 });
    });

    it('should be able to set a single value in an array', () => {
      const result = autoReducer(testStateObject, { type: 'set', path: ['tags', 1], value: 'altered' });

      expect(result.tags).toEqual(['green', 'altered']);
    });

    it('should be able to set multiple values in an array', () => {
      const result = autoReducer(testStateObject, {
        type: 'set',
        path: ['tags', [0, 1]],
        value: 'duplicate',
      });

      expect(result.tags).toEqual(['duplicate', 'duplicate']);
    });
  });
  describe('merge action type', () => {
    it('should merge the target object with the provided value', () => {
      const result = autoReducer(testStateObject, {
        type: 'merge',
        path: ['attributes', 0],
        value: { type: 'powerLevel', freq: 0.25 },
      });

      expect(result.attributes[0]).toEqual({ type: 'powerLevel', data: 5, freq: 0.25 });
    });
  });
  describe('omit action type', () => {
    it('should remvove the key from the target object', () => {
      const result = autoReducer(testStateObject, {
        type: 'omit',
        path: ['attributes', 0],
        key: 'data',
      });

      expect(result.attributes[0]).toEqual({ type: 'level' });
    });

    it('should remvove all the keys, if an array is provided, from the target object', () => {
      const result = autoReducer(testStateObject, {
        type: 'omit',
        path: ['attributes', 0],
        key: ['type', 'data'],
      });

      expect(result.attributes[0]).toEqual({ });
    });
  });
  describe('insertAt action type', () => {
    it('should insert a value into an array at an index', () => {
      const result = autoReducer(testStateObject, {
        type: 'insertAt',
        path: ['attributes'],
        index: 1,
        value: { name: 'new item' },
      });

      expect(result.attributes).toHaveLength(4);
      expect(result.attributes[1]).toEqual({ name: 'new item' });
    });
  });
  describe('removeAt action type', () => {
    it('should remove a value from an array at an index', () => {
      const result = autoReducer(testStateObject, {
        type: 'removeAt',
        path: ['attributes'],
        index: 1,
      });

      expect(result.attributes).toHaveLength(2);
      expect(result.attributes[1]).toEqual({
        type: 'characters',
        data: [
          { name: 'janice' },
          { name: 'george', status: 'missing' },
        ],
      });
    });
  });
  describe('insertFirst action type', () => {
    it('should add an item to the start of an array', () => {
      const result = autoReducer(testStateObject, {
        type: 'insertFirst',
        path: ['attributes'],
        value: { name: 'new item' },
      });

      expect(result.attributes).toHaveLength(4);
      expect(result.attributes[0]).toEqual({ name: 'new item' });
    });
  });
  describe('removeFirst action type', () => {
    it('should remove an item to the start of an array', () => {
      const result = autoReducer(testStateObject, {
        type: 'removeFirst',
        path: ['attributes'],
      });

      expect(result.attributes).toHaveLength(2);
      expect(result.attributes[0]).toEqual({ type: 'stacks', data: [32, 40, 101] });
    });
  });
  describe('insertLast action type', () => {
    it('should insert an item at the end of an array', () => {
      const result = autoReducer(testStateObject, {
        type: 'insertLast',
        path: ['attributes'],
        value: { name: 'new item' },
      });

      expect(result.attributes).toHaveLength(4);
      expect(result.attributes[3]).toEqual({ name: 'new item' });
    });
  });
  describe('removeLast action type', () => {
    it('should insert an item at the end of an array', () => {
      const result = autoReducer(testStateObject, {
        type: 'removeLast',
        path: ['attributes'],
      });

      expect(result.attributes).toHaveLength(2);
      expect(result.attributes[1]).toEqual({ type: 'stacks', data: [32, 40, 101] });
    });
  });
});
