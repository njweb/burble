require('regenerator-runtime/runtime');
import fs from 'mz/fs'

const labelString = (labelRoot) => labelRoot + ' with: ';

export const parseFile = (filename) => {
  let parts = filename.split('@');
  console.log("HERE", parts[0]);
  return fs.exists(parts[0])
    .then((result) => {
      console.log('HERE A');
      if (!result) throw Error('File not found');
      return fs.readFile(parts[0], 'utf8');
    }).then((data) => {
      console.log("HERE B");
      data = JSON.parse(data);
      if (parts[1]) {
        const key = parts[1];
        if (!data.hasOwnProperty(key)) throw Error('Examples are missing requested property');
        if (!Array.isArray(data[key])) throw Error('Examples must be stored in an array');
        return data[key];
      } else {
        if (!Array.isArray(data)) throw Error('Examples must be stored in an array');
        return data;
      }
    });
};

const wrapTest = (test, element, callback) => {
  try {
    test(element);
    callback();
  } catch (e) {
    callback(e);
  }
};

const burble = ({examples, iterator, filename, iteratorCycles = 10}) => {
  if (!examples && !iterator && !filename) throw Error('Burble needs at least one example source');

  return (description, test) => {
    return Promise.resolve((res => {
      if (examples) {
        console.log("EXAMPLES");
        examples.forEach(e => it(description, test.bind(null, e)));
      }
    })()).then(() => {
      if (filename) {
        console.log("FILENAME", filename);
        return parseFile(filename)
          .then(examples => {
            console.log("E ------> ", examples, Array.isArray(examples));
            examples.forEach(e => {
              console.log("HERE C", e);
              it(description, test.bind(null, e));
            });
          });
      }
    }).then(() => {
      if (iterator) {
        console.log("ITERATOR");
        let abort = false;
        let counter = 0;
        let item = iterator.next();
        while (counter++ < iteratorCycles && !item.done && !abort) {
          wrapTest(test, item.value, e => {
            if (e) {
              it(description, () => {
                throw e;
              });
              abort = true;
            }
          });
          item = iterator.next();
        }
      }
    });
  }
};

export default burble;