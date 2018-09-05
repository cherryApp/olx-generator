const builder = require('xmlbuilder'),
    path = require('path'),
    util = require('../module/util'),
    appSettings = require('./settings'),
    targz = require('targz'),
    Chapter = require('../module/content/chapter');

module.exports = class Generator {
    constructor(courseData, courseDirectory, args) {
        this.courseData = courseData;
        this.courseDirectory = courseDirectory;
        this.args = args;
        this.basicCourseData = ['url_name', 'org', 'course'];

        // Course items.
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
                this.createChapters();
                // this.testContent();
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
            'course/course',
            this.courseData.url_name + '.xml'
        );

        for (let k in this.courseData) {
            if (this.basicCourseData.indexOf(k) < 0 && k.substr(0, 1) !== '_') {
                xml.att(k, this.courseData[k]);
            }
        }
        xml.att('course', this.courseData.url_name);

        // <chapter url_name="94655354a6ec4155b5bf048447a2963e"/>
        for (let k in this.chapters) {
            xml.ele('chapter')
                .att('url_name', this.chapters[k].filename)
                .up();
        }

        xml.end({pretty: true});

        util.writeFilePromise(filePath, xml.toString())
            .then( () => {
                if (!appSettings.json.createTar) {
                    return null;
                }

                targz.compress({
                    src: path.join(this.courseDirectory, '/'),
                    dest: path.join(
                        this.courseDirectory, 
                        '..', 
                        `${appSettings.json.name}.tar.gz`
                    ),
                    tar: {
                        ignore: function(name) {
                            console.log('Name: ', name);
                            return name === '.' // ignore . files when packing
                        }
                    },
                }, (err) => {
                    if (err) return console.error(err);
                    console.log("TAR saved");
                });
            }).catch( err => {
                console.error(err);
            });
    }

    // Create chapters.
    createChapters() {
        let waitForChapters = [];
        for (let k in this.courseData._chapters) {
            let chapter = new Chapter(
                this.courseData._chapters[k], 
                this.courseDirectory, 
                this.args
            );
            this.chapters[chapter.filename] = chapter;
            waitForChapters.push(chapter.watcher);
        }

        // Create detailed course xml file.
        Promise.all(waitForChapters).then(
            values => this.createCourseXML()
        ).catch( err => console.error(err) );
    }
};