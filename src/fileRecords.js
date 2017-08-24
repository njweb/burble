import fs from 'fs'

export const parseFile = filename => {
  return new Promise((res, rej) => {
    fs.stat(filename, (err, stats) => {
      if (err) rej(err);
      else if (!stats.isFile()) rej(Error('No file found'));
      else {
        fs.readFile(filename, 'utf8', (err, fileContents) => {
          if (err) rej(err);
          res(JSON.parse(fileContents));
        });
      }
    });
  });
};

const pFileExists = filename => {
  console.log('HERE');
  return new Promise((res, rej) => {
    fs.stat(filename, (err, fileStats) => {
      console.log(err + ' ------------- ' + fileStats);
      if (err) rej(err);
      if (fileStats.isFile()) res(true);
      else res(false);
    });
  });
};

const pReadFile = filename => {
  return new Promise((res, rej) => {
    fs.readFile(filename, 'utf8', (err, fileContents) => {
      if (err) rej(err);
      else {
        res(JSON.parse(fileContents));
      }
    });
  });
};

const fileRecords = [];

export const pFetchRecord = (filename, key) => {
  //check records
  //then check filesystem
  console.log("HERE A");
  let record = fileRecords.find(r => r.filename === filename);
  if (record) return Promise.resolve(record);
  else {
    return pFileExists(filename)
      .then(exists => {
        if (exists) {
          return pReadFile(filename)
            .then(fileContents => {
              const record = {
                filename,
                values: Object.append(fileContents, {key: fileContents[key] ? fileContents.key : []}),
                exists: true
              };
              fileRecords.push(record);
              return record;
            })
        } else {
          return {
            filename,
            values: {key: []},
            exists: false
          }
        }
      })
  }
};

const pUpdate = (record, value) => {

};

export const fileSource = {
  addFile: (filename, key = 'default') => {

  },
  addValue: (fileReference, value) => {
  }
};