const cheerio = require('cheerio');

module.exports = class Generator {
    constructor(siteData) {
        this.siteData = siteData;
        this.$ = cheerio.load(this.siteData);
        this.init();
    }

    init() {
        this.createCourse();
    }

    createCourse() {
        let title = this.$('title').text();
        
    }
};