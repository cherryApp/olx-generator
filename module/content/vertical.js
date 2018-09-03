// Vertical structure for arrange elements.
const Content = require('./content'),
      HTML = require('./html'),
      hash = require('object-hash'),
      path = require('path'),
      builder = require('xmlbuilder'), 
      util = require('../util');

module.exports = class Vertical extends Content {
    constructor(url, display_name, data, baseDir) {
        super(url, display_name, data, baseDir);

        // Generate custom hash.
        this.filename = hash({
            url: this.url,
            data: this.data
        });

        // Init children.
        this.videos = {};
        this.htmls = {};
        this.problems = {};
        this.discussions = {};

        this.createHTML();
        this.createXML();
    }

    createHTML() {
        let html = new HTML(this.url, '', this.data, this.baseDir);
        this.display_name = html.display_name;
        this.videos = html.videos;
        this.htmls[html.filename] = html;
        this.allPromise.push(html.watcher);
    }

    createXML() {
        /*
        <vertical display_name="HTML Markup Language">
            <video url_name="d1cb16dbb52b45dd9f36c02f692c0227"/>
            <video url_name="8dfa720dbf834fe8afbd66d868cf27c1"/>
            <html url_name="c2e2846b5e634c868060d2557aa84cd9"/>
            <problem url_name="cb769b006de5441884c8876bea752cb0"/>
            <discussion url_name="4fb2924e610e4eef8e3cf4cc99a8282c" 
                xblock-family="xblock.v1"/>
        </vertical>
        */
        let xml = builder.create('vertical');
        xml.att('display_name', this.display_name);

        for (let k in this.videos) {
            xml.ele('video')
                .att('url_name', k)
                .up();
        }

        for (let k in this.htmls) {
            xml.ele('html')
                .att('url_name', k)
                .up();
        }

        xml.end({pretty: true});
        this.xml = xml.toString();
        
        util.writeFilePromise(
            path.join(this.baseDir, 'course/vertical', this.filename+'.xml'),
            this.xml
        ).then(
            () => {
                console.log(`Vertical ${this.filename} written.`);
                this.done();
            }
        ).catch(
            err => this.catch(err)
        );
    }
}