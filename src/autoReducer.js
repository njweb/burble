const immutableSplice = (arr, index, count, value) => {
  const nextArr = [...arr];
  if (value !== undefined) nextArr.splice(index, count, value);
  else nextArr.splice(index, count);
  return nextArr;
};

const immutableSet = (obj, key, value) => (
  obj[key] === value ? obj :
    Array.isArray(obj) ?
      immutableSplice(obj, key, 1, value) :
      { ...obj, [key]: value }
);

const actionTypes = {
  merge: (target, action) => ({ ...target, ...action.payload }),
  set: (target, action) => (
    action.key === undefined ?
      action.payload :
      immutableSet(target, action.key, action.payload)
  ),
  omit: (target, action) => (
    Object.keys(target)
      .filter(k => !action.payload.includes(k))
      .reduce((acc, k) => ({ ...acc, [k]: target[k] }), {})
  ),
  insertAt: (target, action) => immutableSplice(target, action.index, 0, action.payload),
  removeAt: (target, action) => immutableSplice(target, action.index, 1),
  insertFirst: (target, action) => [action.payload, ...target],
  insertLast: (target, action) => [...target, action.payload],
  removeFirst: (target, action) => immutableSplice(target, 0, 1),
  removeLast: (target, action) => immutableSplice(target, -1, 1),
};

const updateTarget = (state, action) => actionTypes[action.type](state, action);

const updateMultipleKeys = (state, action, path, keys) => {
  const nextState = [...state];
  keys.forEach(k => nextState.splice(k, 1, walkPath(path, state[k], action)))
  return nextState;
}

const walkPath = (path, state, action) => {
  if (path && path.length > 0) {
    const [key, ...rest] = path;
    if (typeof key === 'string' || Number.isInteger(key)) {
      return immutableSet(state, key, walkPath(rest, state[key], action));
    } else if (Array.isArray(key)) {
      return updateMultipleKeys(state, action, rest, key)
    }
    throw Error(`Could not reduce action with path: ${JSON.stringify(action.path)}`);
  } else {
    return updateTarget(state, action);
  }
}

const autoReducer = (state, action) => {
  return walkPath(action.path, state, action);
}

export default autoReducer;

