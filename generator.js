// Use this:
// node generator -j generator.json

const http = require('http'),
    path = require('path'),
    appSettings = require('./module/settings'),
    args = require('./module/parser'),
    util = require('./module/util'),
    OlxGenerator = require('./module/olxGenerator');

// Check json.
if (!args.json) {
    console.error('Please give the json!');
    process.exit(1);
}

// Init course.
let jsonFile = path.join(__dirname, args.json);
appSettings.init(jsonFile)
    .then( jsonSettings => {
        if (jsonSettings.silent) {
            console.log = () => {};
        }
        try {
            let courseDirectory = path.join(
                __dirname, 'olx', jsonSettings.name
            );
            args.header = util.parseHeaders(jsonSettings.header);
            const course = new OlxGenerator(
                jsonSettings.course, 
                courseDirectory, 
                args
            );
        } catch (err) {
            console.error('Error while processing: ', err);
        }
    });

