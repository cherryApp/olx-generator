// Vertical structure for arrange elements.
const Content = require('./content'),
      hash = require('object-hash'),
      path = require('path'),
      builder = require('xmlbuilder'), 
      util = require('../util'),
      Vertical = require('./vertical');

module.exports = class Sequential extends Content {
    constructor(url, display_name, data, baseDir) {
        super(url, display_name, data, baseDir);

        // Init children.
        this.verticals = {};

        this.createVertical();
        this.createXML();
    }

    createVertical() {
        let vert = new Vertical(this.url, '', this.data, this.baseDir);
        this.display_name = vert.display_name;
        this.verticals[vert.filename] = vert;
    }

    createXML() {
        /*
        <sequential display_name="More Ways to Connect">
            <vertical url_name="3f2c11aba9434e459676a7d7acc4d960"/>
        </sequential>
        */
        let xml = builder.create('sequential');
        xml.att('display_name', this.display_name);

        for (let k in this.verticals) {
            xml.ele('vertical')
                .att('url_name', k)
                .up();
        }

        xml.end({pretty: true});
        this.xml = xml.toString();

        // Generate filename from custom hash.
        this.filename = hash({
            url: this.url,
            vertical: Object.keys(this.verticals)[0]
        });
        
        util.writeFilePromise(
            path.join(this.baseDir, 'course/sequential', this.filename+'.xml'),
            this.xml
        ).then(
            () => console.log(`Sequential ${this.filename} written.`)
        ).catch(
            err => console.error(err)
        );
    }
}