const cheerio = require('cheerio'),
    builder = require('xmlbuilder'),
    path = require('path'),
    got = require('got'),
    util = require('../module/util'),
    Sequential = require('../module/content/sequential');

module.exports = class Generator {
    constructor(courseData, courseDirectory, args) {
        this.courseData = courseData;
        this.courseDirectory = courseDirectory;
        this.args = args;
        this.basicCourseData = ['url_name', 'org', 'course'];

        // Course items.
        this.sequentials = {};
        this.chapters = {};

        this.init();
    }

    init() {
        this.createStructure();
    }

    createStructure() {
        // Create structure of course directories.
        let dirs = [];
        dirs.push( util.mkdirPromise(this.courseDirectory) );
        dirs.push( util.mkdirPromise(this.courseDirectory, 'course') );
        dirs.push( util.mkdirPromise(this.courseDirectory, 'course/about') );
        dirs.push( util.mkdirPromise(this.courseDirectory, 'course/assets') );
        dirs.push( util.mkdirPromise(this.courseDirectory, 'course/chapter') );
        dirs.push( util.mkdirPromise(this.courseDirectory, 'course/course') );
        dirs.push( util.mkdirPromise(this.courseDirectory, 'course/drafts') );
        dirs.push( util.mkdirPromise(this.courseDirectory, 'course/html') );
        dirs.push( util.mkdirPromise(this.courseDirectory, 'course/info') );
        dirs.push( util.mkdirPromise(this.courseDirectory, 'course/policies') );
        dirs.push( util.mkdirPromise(this.courseDirectory, 'course/problem') );
        dirs.push( util.mkdirPromise(this.courseDirectory, 'course/sequential') );
        dirs.push( util.mkdirPromise(this.courseDirectory, 'course/static') );
        dirs.push( util.mkdirPromise(this.courseDirectory, 'course/tabs') );
        dirs.push( util.mkdirPromise(this.courseDirectory, 'course/vertical') );
        dirs.push( util.mkdirPromise(this.courseDirectory, 'course/video') );

        Promise.all(this.courseDirectory).then(
            () => {
                this.createCourse();
                this.testContent();
                // this.createContent();
            }
        ).catch( 
            err => console.error(err) 
        );
        
    }

    // Crate base xml.
    createCourse() {
        let xml = builder.create('course');
        let filePath = path.join(
            this.courseDirectory, 
            'course/course.xml'
        );

        for (let k in this.courseData) {
            if (this.basicCourseData.indexOf(k) > -1) {
                xml.att(k, this.courseData[k]);
            }
        }
        xml.end({pretty: true});

        util.writeFilePromise(filePath, xml.toString())
            .then( () => {
                console.log('Ok: course.xml');
            }).catch( err => {
                console.error(err);
            });
    }

    // Create detailed description xml.
    createCourseXML() {
        // let title = this.$('title').text();
        let xml = builder.create('course');
        let filePath = path.join(
            this.courseDirectory, 
            'course/course/course.xml'
        );

        for (let k in this.courseData) {
            if (this.basicCourseData.indexOf(k) < 0) {
                xml.att(k, this.courseData[k]);
            }
        }

        // <chapter url_name="94655354a6ec4155b5bf048447a2963e"/>
        xml.ele('chapter').att('url_name', 'fejezet').up();

        xml.end({pretty: true});

        util.writeFilePromise(filePath, xml.toString())
            .then( () => {
                console.log('ok');
            }).catch( err => {
                console.error(err);
            });
    }

    // Test function for the content.
    testContent() {
        let requests = [],
            htmlDir = path.join(this.courseDirectory);
        
        let client = got.extend({
            baseUrl: this.args.urls[5],
            headers: this.args.header,
            encoding: 'utf8'
        });

        client.get('/')
            .then(
                data => {
                    let seq = new Sequential(data.url, '', data.body, htmlDir);
                    this.sequentials[seq.filename] = seq;
                    console.log( this.sequentials );
                }
            )
            .catch( 
                err => console.error( err )
            );
    }

    // Create content of course.
    createContent() {

        let requests = [],
            htmlDir = path.join(this.courseDirectory);
        
        for (let k in this.args.urls) {
            let client = got.extend({
                baseUrl: this.args.urls[k],
                headers: this.args.header,
                encoding: 'utf8'
            });
            requests.push( client.get('/') );
        }

        Promise.all(requests)
            .then( 
                values => {
                    for (let k in values) {
                        let html = new HTML(values[k].url, '', values[k].body, htmlDir);
                    }
                }
            )
            .catch( 
                err => console.error(err) 
            );
    }
};