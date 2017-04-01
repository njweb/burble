require('regenerator-runtime/runtime');

const burble = function*(arr) {
  for(let i = 0; i < arr.length; i += 1){
    yield arr[i];
  }
  return;
};

export default burble;