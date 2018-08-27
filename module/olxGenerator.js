const cheerio = require('cheerio'),
    builder = require('xmlbuilder');

module.exports = class Generator {
    constructor(courseData) {
        /*
        this.siteData = siteData;
        this.$ = cheerio.load(this.siteData);
        */
        this.courseData = courseData;
        this.init();
    }

    init() {
        this.createCourse();
    }

    createCourse() {
        // let title = this.$('title').text();
        let xml = builder.create('course');
        for (let k in this.courseData) {
            xml.att(k, this.courseData[k]);
        }
        xml.end({pretty: true});
        console.log(xml.toString());
    }
};