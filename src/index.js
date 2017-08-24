require('regenerator-runtime/runtime');
import fs from 'fs'

export const parseFile = filename => {
  const parts = filename.split('@');
  return new Promise((res, rej) => {
    fs.stat(parts[0], (err, stats) => {
      if (err) rej(err);
      else if (!stats.isFile()) rej(Error('No file found'));
      else {
        fs.readFile(parts[0], 'utf8', (err, fileContents) => {
          if (err) rej(err);
          const data = JSON.parse(fileContents);

          let output = data;
          if (parts[1]) output = data[parts[1]];
          if (!Array.isArray(output)) rej(Error(parts[1] ? 'Examples not found at ' + parts[1] : 'Examples not found'));
          else res(output);
        });
      }
    });
  });
};

const testWithExamples = (examples, test) => {
  examples.forEach(v => test(v));
};

const testWithIterator = (iterator, test) => {
  let counter = 0;
  let item = iterator.next();
  while (!item.done && counter++ < 10) {
    try {
      test(item.value);
    } catch (e) {
      throw e;
    }
    item = iterator.next();
  }
};

const burble = ({examples, iterator, filename}) => {

  return (test) => {
    return Promise.resolve(examples ? testWithExamples(examples, test) : null)
      .then(() => {
        if (filename) {
          return parseFile(filename);
        }
      }).then(fileExamples => {
        if (fileExamples) {
          testWithExamples(fileExamples, test);
        }
      }).then(() => {
        if (iterator) {
          testWithIterator(iterator, test);
        }
      });
  }

};

export default burble;