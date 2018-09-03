// Video content.
const Content = require('./content'),
      builder = require('xmlbuilder'),
      path = require('path'),
      hash = require('object-hash'),
      util = require('../util');

module.exports = class Video extends Content {
    constructor(url, display_name, data, baseDir) {
        super(url, display_name, data, baseDir);
        this.body = null;
        this.xml = null;
        this.processData();
    }

    processData() {
        // Source element.
        let sAtts = this.data[1].find('source')[0].attribs;
        this.filename = hash(sAtts.src);
        
        // Video element.
        let atts = this.data[0].attribs;
        let xml = builder.create('video');
        xml.att('url_name', this.filename);
        xml.att('display_name', this.display_name);
        for (let k in atts) {
            xml.att(k, atts[k]);
        }
        xml.ele('source', sAtts).up();        
        
        // Finishing.
        xml.end({pretty: true});
        this.xml = xml.toString();

        util.writeFilePromise(
            path.join(this.baseDir, 'course/video', this.filename+'.xml'),
            this.xml
        ).then(
            () => {
                console.log(`Video ${this.filename} written.`);
                this.done();
            }
        ).catch(
            err => {
                console.error(err);
                this.catch(err);
            }
        );
    }
}