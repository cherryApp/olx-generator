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
    static writeFilePromise(filePath, fileData, opts = 'utf8') {
        return new Promise( (resolve, reject) => {
            fs.writeFile(filePath, fileData, opts, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }

    // Parse http headers.
    static parseHeaders(headers) {
        let head = {};
        headers = headers.split('|');
        if (headers.length === 2) {
            head[headers[0]] = headers[1];
        }
        return head;
    }
};