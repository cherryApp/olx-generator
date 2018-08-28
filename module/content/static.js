// Assets: image, etc...
const Content = require('./content'),
      builder = require('xmlbuilder'),
      path = require('path'),
      hash = require('object-hash'),
      got = require('got'),
      util = require('../util'),
      download = require('download-file');

module.exports = class Static extends Content {
    constructor(url, display_name, data, baseDir) {
        super(url, display_name, data, baseDir);
        this.body = null;
        this.xml = null;
        this.processData();
    }

    processData() {
        let url = new URL(this.data[1].attr('src'), this.url);
        let fileName = url.pathname.split('/').pop();
        let staticURL = url.href;
        let staticDir = path.join(this.baseDir, 'course/static');
        
        let downloadOptions = {
            directory: staticDir,
            filename: fileName
        };

        download(staticURL, downloadOptions, (err) => {
            if (err) {
                return console.error( err );
            }
            console.log(`File ${fileName} saved.`);
        });
    }
}