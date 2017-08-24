var burble = function burble(obj) {
  return function (listener) {
    Object.keys(obj).forEach(function (key) {
      var value = obj[key];
      listener([key, value]);
    });
    return obj;
  };
};

export default burble;
