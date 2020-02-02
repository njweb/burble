import actionArrayMiddleware from './actionArrayMiddleware';

let nextReceivedObjects = [];
const mockNext = a => nextReceivedObjects.push(a);

describe('action array middleware', () => {
  beforeEach(() => {
    nextReceivedObjects = [];
  })
  describe('when passed an action array', () => {
    it('should pass each action object to the next function', () => {
      const testActions = [{ type: 'abc' }, { type: 'def' }];
      actionArrayMiddleware({})(mockNext)(testActions);

      expect(nextReceivedObjects).toEqual([{ type: 'abc' }, { type: 'def' }]);
    });
  });
  describe('when passed a single action', () => {
    it('should pass through the action object unaffected', () => {
      actionArrayMiddleware({})(mockNext)({ type: 'abc' });
      expect(nextReceivedObjects).toEqual([{ type: 'abc' }]);
    });
  });
});
