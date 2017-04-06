require('regenerator-runtime/runtime');


const burble = function (testingHandler) {
  const parseArgsTail = (args) => {
    let argsArray = [];
    for (let i = 1; i < args.length; i += 1) {
      argsArray.push(args[i]);
    }
    return argsArray;
  };

  const generatorArgs = parseArgsTail(arguments);

  return new Promise((res, rej) => {
    testingHandler(function *() {
      for (let gen of generatorArgs) {
        console.log('GEN: ', gen);
        yield* gen;
      }
      res();
    });
  });
};

export default burble;