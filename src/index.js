const burbleWithContext = (obj, context = []) => listener => {
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    if(typeof value !== 'function') {
      if(typeof value === 'object') {
        listener(
          [
            context.concat(key),
            burbleWithContext(value, context.concat(key))
          ]
        );
      } else listener([context.concat(key), value]);
    }
  });
  return obj;
};

const burble = obj => burbleWithContext(obj);

export default burble;