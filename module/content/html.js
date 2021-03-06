// HTML content.
const Content = require('./content'),
      Video = require('./video'),
      Static = require('./static'),
      util = require('../util'),
      appSettings = require('../settings'),
      cheerio = require('cheerio'),
      builder = require('xmlbuilder'),
      path = require('path');

module.exports = class HTML extends Content {
    constructor(url, display_name, data, baseDir) {
        super(url, display_name, data, baseDir);

        this.$ = null;
        this.body = null;
        this.xml = null;
        this.videos = {};
        this.assets = [];
        this.statics = [];
        
        this.processData();
    }
    
    processData() {
        this.$ = cheerio.load(this.data);
        this.display_name = this.$('title').text();
        this.getVideosAndAssets();        
        
        let body = cheerio.load( this.$(appSettings.json.html.root).html() );
        this.body = body.html({decodeEntities: false})  
        .replace(/<html>|<\/html>|<body>|<\/body>|<head>|<\/head>/g, '');
        
        // <html filename="0a3b4139f51a4917a3aff9d519b1eeb6" display_name="Videos on edX"/>
        let xml = builder.create('html');
        xml.att('filename', this.filename);
        xml.att('display_name', this.display_name);
        xml.end({pretty: true});
        this.xml = xml.toString();
        
        Promise.all(this.allPromise).then(
            values => this.writeFiles()
        ).catch( err => this.catch(err) );
    }

    writeFiles() {
        Promise.all([
            util.writeFilePromise(
                path.join(this.baseDir, 'course/html', this.filename+'.xml'),
                this.xml
            ),
            util.writeFilePromise(
                path.join(this.baseDir, 'course/html', this.filename+'.html'),
                this.body
            )
        ])
        .then( 
            () => {
                console.log( 'HTML was write.' );
                this.done();
            }
        )
        .catch( 
            err => this.catch(err)
        );
    }

    getVideosAndAssets() {
        // Save assets.
        this.$('img').each( (ind, elem) => {
            let cheerioElem = this.$(elem);
            let newSrc = path.basename(cheerioElem.attr('src'));
            let staticContent = new Static(
                this.url, '', [elem, cheerioElem], this.baseDir
            ); 
            this.statics.push(staticContent);
            this.allPromise.push(staticContent.watcher);
            cheerioElem.attr( 'src', `/static/${newSrc}` );
        });

        // Remove unnecessary elements.
        this.$(appSettings.json.html.root)
            .find(appSettings.json.html.remove)
            .remove();

        if (appSettings.json.video.separate) {
            this.$(appSettings.json.video.selector).each( (ind, elem) => {
                let video = new Video(
                    this.url, '', [elem, this.$(elem)], this.baseDir
                ) ;
                this.videos[video.filename] = video;
                this.allPromise.push(video.watcher);
            });

            this.$(appSettings.json.html.root)
                .find(appSettings.json.video.selector)
                .remove();
        }
    }
}