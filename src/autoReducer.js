import timm from 'timm';

const actionTypes = {
  merge: (target, action) => timm.merge(target, action.value),
  set: (target, action) => action.key ? timm.set(target, action.key, action.value) : action.value,
  omit: (target, action) => timm.omit(target, action.key),
  insertAt: (target, action) => timm.insert(target, action.index, action.value),
  removeAt: (target, action) => timm.removeAt(target, action.index),
  insertFirst: (target, action) => timm.addFirst(target, action.value),
  insertLast: (target, action) => timm.addLast(target, action.value),
  removeFirst: (target, action) => timm.removeFirst(target),
  removeLast: (target, action) => timm.removeLast(target),
};

const updateTarget = (target, action) => {
  return actionTypes[action.type](target, action);
};

const walkPath = (path, state, action) => {
  if (path && path.length > 0) {
    const [key, ...rest] = path;
    if (typeof key === 'string' || Number.isInteger(key)) {
      return timm.set(state, key, walkPath(rest, state[key], action));
    } else if (Array.isArray(key)) {
      return key.reduce((s, k) => timm.replaceAt(s, k, walkPath(rest, state[k], action)), state)
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

