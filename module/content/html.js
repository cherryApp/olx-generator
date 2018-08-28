// HTML content.
const Content = require('./content'),
      Video = require('./video'),
      util = require('../util'),
      cheerio = require('cheerio'),
      builder = require('xmlbuilder'),
      path = require('path');

module.exports = class HTML extends Content {
    constructor(url, display_name, data) {
        super(url, display_name, data);

        this.$ = null;
        this.body = null;
        this.xml = null;
        this.videos = [];
        
        this.processData();
    }
    
    processData() {
        this.$ = cheerio.load(this.data);
        this.display_name = this.$('title').text();
        let body = cheerio.load( this.$('body > .container').html() );
        this.body = body.html({decodeEntities: false})  
                        .replace(/<html>|<\/html>|<body>|<\/body>|<head>|<\/head>/g, '');

        // <html filename="0a3b4139f51a4917a3aff9d519b1eeb6" display_name="Videos on edX"/>
        let xml = builder.create('html');
        xml.att('filename', this.filename);
        xml.att('display_name', this.display_name);
        xml.end({pretty: true});
        this.xml = xml.toString();

        this.getVideos();
    }

    writeFiles(baseDir) {
        Promise.all([
            util.writeFilePromise(
                path.join(baseDir, this.filename+'.xml'),
                this.xml
            ),
            util.writeFilePromise(
                path.join(baseDir, this.filename+'.html'),
                this.body
            )
        ])
        .then( 
            () => console.log( 'HTML was write.' )
        )
        .catch( 
            err => console.error(err) 
        );
    }

    getVideos() {
        let videoList = this.$('video');
        for (let k in videoList) {
            this.videos.push( new Video('', '', videoList[k]) );
        }
    }
}