const fs = require('fs'),
      settings = {};

const init = (jsonFile) => {
    return new Promise( (resolve, reject) => {
        fs.readFile(jsonFile, 'utf8', (err, jsonData) => {
            if (err) {
                console.error('Json is not exists!');
                process.exit(1);
            }

            try {
                jsonData = JSON.parse(jsonData);
                for (let k in jsonData) {
                    settings[k] = jsonData[k];
                    resolve(settings);
                }
            } catch (err) {
                process.exit('Wrong format of json file.');
            }            
        });
    });
};

module.exports = {
    init: init,
    json: settings
};
