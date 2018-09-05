// Vertical structure for arrange elements.
const hash = require('object-hash'),
      got = require('got'),
      path = require('path'),
      builder = require('xmlbuilder'), 
      util = require('../util'),
      Sequential = require('./sequential');

module.exports = class Chapter {
    constructor(chapterData, courseDirectory, args) {
        this.chapterData = chapterData;
        this.courseDirectory = courseDirectory;
        this.args = args;

        // Generate filename from custom hash.
        this.filename = hash(this.chapterData.urls);

        // Init children.
        this.sequentials = {};

        // Wait for sequentials is done.
        this.allPromise = [];
        this.done = null;
        this.catch = null;
        this.watcher = new Promise( (resolve, reject) => {
            this.done = resolve;
            this.catch = reject;
        });

        this.createSequentials();
    }
    
    // Create content of course.
    createSequentials() {
        let requests = [],
        htmlDir = path.join(this.courseDirectory);
        
        for (let k in this.chapterData.urls) {
            let client = got.extend({
                baseUrl: this.chapterData.urls[k],
                headers: this.args.header,
                encoding: 'utf8'
            });
            requests.push( client.get('/') );
        }
        
        Promise.all(requests).then( 
            values => {
                for (let k in values) {
                    let seq = new Sequential(
                        values[k].url, 
                        '', 
                        values[k].body, 
                        htmlDir
                    );
                    this.sequentials[seq.filename] = seq;
                    this.allPromise.push(seq.watcher);                    
                }
                
                Promise.all(this.allPromise).then(
                    values => this.createXML()
                ).catch( err => this.catch(err) );
            }
        )
        .catch( 
                err => console.error(err) 
            );

    }

    createXML() {
        /*
        <chapter display_name="About Exams and Certificates" 
            start="&quot;1970-01-01T05:00:00+00:00&quot;">
            <sequential url_name="workflow"/>
        </chapter>
        */
        let xml = builder.create('chapter');
        xml.att('display_name', this.chapterData.display_name);
        // xml.att('start', '&quot;1970-01-01T05:00:00+00:00&quot;');

        for (let k in this.sequentials) {
            xml.ele('sequential')
                .att('url_name', k)
                .up();
        }

        xml.end({pretty: true});
        this.xml = xml.toString();
        
        util.writeFilePromise(
            path.join(this.courseDirectory, 'course/chapter', this.filename+'.xml'),
            this.xml
        ).then(
            () => {
                console.log(`Chapter ${this.filename} written.`);
                this.done();
            }
        ).catch(
            err => this.catch(err)
        );
    }
}