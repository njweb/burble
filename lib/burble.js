(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.burble = global.burble || {})));
}(this, (function (exports) { 'use strict';

var burble = function burble(obj) {
  return function (listener) {
    Object.keys(obj).forEach(function (key) {
      var value = obj[key];
      listener([key, value]);
    });
    return obj;
  };
};

exports['default'] = burble;

Object.defineProperty(exports, '__esModule', { value: true });

})));
