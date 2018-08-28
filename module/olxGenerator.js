const cheerio = require('cheerio'),
    builder = require('xmlbuilder'),
    path = require('path'),
    util = require('../module/util');

module.exports = class Generator {
    constructor(courseData, courseDirectory) {
        /*
        this.siteData = siteData;
        this.$ = cheerio.load(this.siteData);
        */
        this.courseData = courseData;
        this.courseDirectory = courseDirectory;
        this.basicCoruseData = ['url_name', 'org', 'course'];
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
            () => this.createCourse()
        ).catch( 
            err => console.error(err) 
        );
        
    }

    createCourse() {
        // let title = this.$('title').text();
        let xml = builder.create('course');
        let filePath = path.join(
            this.courseDirectory, 
            'course/course.xml'
        );

        for (let k in this.courseData) {
            if (this.basicCoruseData.indexOf(k) > -1) {
                xml.att(k, this.courseData[k]);
            }
        }
        xml.end({pretty: true});

        util.writeFilePromise(filePath, xml.toString())
            .then( () => {
                this.crateCourseMeta();
            }).catch( err => {
                console.error(err);
            });
    }

    crateCourseMeta() {
        // let title = this.$('title').text();
        let xml = builder.create('course');
        let filePath = path.join(
            this.courseDirectory, 
            'course/course/course.xml'
        );

        for (let k in this.courseData) {
            if (this.basicCoruseData.indexOf(k) < 0) {
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
};