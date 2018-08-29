// Base content.
const hash = require('object-hash');

module.exports = class Content {
    constructor(url, display_name, data, baseDir) {
        this.url = url;
        this.display_name = display_name;
        this.data = data;
        this.baseDir = baseDir;
        this.filename = hash(this.url);
        this.hdata = hash(this.data);
        this.url_name = this.hdata;
        this.xml = '';
    }
}
