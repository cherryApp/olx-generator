// Video content.
const Content = require('./content'),
      builder = require('xmlbuilder'),
      path = require('path'),
      hash = require('object-hash'),
      util = require('../util');

module.exports = class Video extends Content {
    constructor(url, display_name, data, baseDir) {
        super(url, display_name, data, baseDir);
        this.body = null;
        this.xml = null;
        this.processData();
    }

    processData() {
        // Source element.
        let sAtts = this.data[1].find('source')[0].attribs;
        this.filename = hash(sAtts.src);
        
        // Video element.
        let atts = this.data[0].attribs;
        let xml = builder.create('video');
        xml.att('url_name', this.filename);
        xml.att('display_name', this.display_name);
        for (let k in atts) {
            xml.att(k, atts[k]);
        }
        xml.ele('source', sAtts).up();        
        
        // Finishing.
        xml.end({pretty: true});
        this.xml = xml.toString();

        util.writeFilePromise(
            path.join(this.baseDir, 'course/video', this.filename+'.xml'),
            this.xml
        ).then(
            () => console.log(`Video ${this.filename} written.`)
        ).catch(
            err => console.error(err)
        );

        /*
        <video youtube="1.00:b7xgknqkQk8" url_name="0b9e39477cf34507a7a48f74be381fdd" display_name="Welcome!" download_track="true" download_video="true" html5_sources="[&quot;https://s3.amazonaws.com/edx-course-videos/edx-edx101/EDXSPCPJSP13-H010000_100.mp4&quot;]" show_captions="true" source="" sub="name_of_file" track="" youtube_id_0_75="" youtube_id_1_0="b7xgknqkQk8" youtube_id_1_25="" youtube_id_1_5="">
            <source src="https://s3.amazonaws.com/edx-course-videos/edx-edx101/EDXSPCPJSP13-H010000_100.mp4"/>
        </video>
        <video url_name="744af8ae4ddffc13de31b8703d8c4f5e0085834c" display_name="" width="560" height="315" controls="" preload="none">
            <source src="https://video.training360.com/Streams/YR-BASICS/yellowroad-basics-karakterek-kodolasa.mp4" type="video/mp4"/>
        </video>
        */
    }
}