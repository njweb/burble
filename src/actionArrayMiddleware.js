const actionArrayMiddleware = store => next => action => (
  Array.isArray(action) ? action.reduce((_, a) => next(a), null) : next(action)
);

export default actionArrayMiddleware;
