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
    it('should replace the root with an empty path array', () => {
      const result = autoReducer(testStateObject, {
        type: 'set',
        path: [],
        payload: { title: 'replacement' },
      });

      expect(result).toEqual({ title: 'replacement' });
    });
    it('should replace the root with an missing path array', () => {
      const result = autoReducer(testStateObject, {
        type: 'set',
        payload: { title: 'replacement' },
      });

      expect(result).toEqual({ title: 'replacement' });
    });
  });
  describe('set action', () => {
    it('should be able to set a value in an object', () => {
      const result = autoReducer(testStateObject, {
        type: 'set',
        path: ['attributes', 2, 'data', 0, 'name'],
        payload: 'madeline',
      });

      expect(result.attributes[2].data[0].name).toEqual('madeline');
    });

    it('should be able to add an attribute to an object', () => {
      const result = autoReducer(testStateObject, {
        type: 'set',
        path: ['attributes', 0, 'freq'],
        payload: 0.25,
      });

      expect(result.attributes[0]).toEqual({ type: 'level', data: 5, freq: 0.25 });
    });

    it('should be able to add an attribute to an object at a key', () => {
      const result = autoReducer(testStateObject, {
        type: 'set',
        path: ['attributes', 0],
        key: 'freq',
        payload: 0.25,
      });

      expect(result.attributes[0]).toEqual({ type: 'level', data: 5, freq: 0.25 });
    });

    it('should be able to set a single value in an array', () => {
      const result = autoReducer(testStateObject, { type: 'set', path: ['tags', 1], payload: 'altered' });

      expect(result.tags).toEqual(['green', 'altered']);
    });

    it('should be able to set multiple values in an array', () => {
      const result = autoReducer(testStateObject, {
        type: 'set',
        path: ['tags', [0, 1]],
        payload: 'duplicate',
      });

      expect(result.tags).toEqual(['duplicate', 'duplicate']);
    });

    it('should return the input object if the transform does not change it', () => {;
      const result = autoReducer(testStateObject, { type: 'set', path: ['tags', 1], payload: 'happy' });

      expect(result === testStateObject).toBe(true);
    });
  });
  describe('merge action', () => {
    it('should merge the target object with the provided value', () => {
      const result = autoReducer(testStateObject, {
        type: 'merge',
        path: ['attributes', 0],
        payload: { type: 'powerLevel', freq: 0.25 },
      });

      expect(result.attributes[0]).toEqual({ type: 'powerLevel', data: 5, freq: 0.25 });
    });
  });
  describe('omit action', () => {
    it('should remvove the key from the target object', () => {
      const result = autoReducer(testStateObject, {
        type: 'omit',
        path: ['attributes', 0],
        payload: 'data',
      });

      expect(result.attributes[0]).toEqual({ type: 'level' });
    });

    it('should remvove all the keys, if an array is provided, from the target object', () => {
      const result = autoReducer(testStateObject, {
        type: 'omit',
        path: ['attributes', 0],
        payload: ['type', 'data'],
      });

      expect(result.attributes[0]).toEqual({ });
    });
  });
  describe('insertAt action', () => {
    it('should insert a value into an array at an index', () => {
      const result = autoReducer(testStateObject, {
        type: 'insertAt',
        path: ['attributes'],
        index: 1,
        payload: { name: 'new item' },
      });

      expect(result.attributes).toHaveLength(4);
      expect(result.attributes[1]).toEqual({ name: 'new item' });
    });
  });
  describe('removeAt action', () => {
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
  describe('insertFirst action', () => {
    it('should add an item to the start of an array', () => {
      const result = autoReducer(testStateObject, {
        type: 'insertFirst',
        path: ['attributes'],
        payload: { name: 'new item' },
      });

      expect(result.attributes).toHaveLength(4);
      expect(result.attributes[0]).toEqual({ name: 'new item' });
    });
  });
  describe('removeFirst action', () => {
    it('should remove an item to the start of an array', () => {
      const result = autoReducer(testStateObject, {
        type: 'removeFirst',
        path: ['attributes'],
      });

      expect(result.attributes).toHaveLength(2);
      expect(result.attributes[0]).toEqual({ type: 'stacks', data: [32, 40, 101] });
    });
  });
  describe('insertLast action', () => {
    it('should insert an item at the end of an array', () => {
      const result = autoReducer(testStateObject, {
        type: 'insertLast',
        path: ['attributes'],
        payload: { name: 'new item' },
      });

      expect(result.attributes).toHaveLength(4);
      expect(result.attributes[3]).toEqual({ name: 'new item' });
    });
  });
  describe('removeLast action', () => {
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
