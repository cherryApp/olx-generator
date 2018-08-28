// Extendable calss for utility funcitons.
const fs = require('fs'),
      path = require('path');
      
module.exports = class Util {

    // Promisified mkdir funciton.
    static mkdirPromise(dirPath = '', childDir = '') {
        return new Promise( (resolve, reject) => {
            dirPath = path.join( dirPath, childDir );
            fs.mkdir(dirPath, (err) => {
                if (err) {
                    if (err.code === 'EEXIST') {
                        return resolve();
                    }
                    return reject(err);
                }
                resolve();
            });
        });
    }

    // Primisify fs.writeFile.
    static writeFilePromise(filePath, fileData) {
        return new Promise( (resolve, reject) => {
            fs.writeFile(filePath, fileData, 'utf8', (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
};