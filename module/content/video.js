// Video content.
const Content = require('./content'),
    cheerio = require('cheerio');

module.exports = class Video extends Content {
    constructor(url, display_name, data) {
        super(url, display_name, data);
        this.processData();
    }

    processData() {
        console.log(this.data);
        /*
        <video youtube="1.00:b7xgknqkQk8" url_name="0b9e39477cf34507a7a48f74be381fdd" display_name="Welcome!" download_track="true" download_video="true" html5_sources="[&quot;https://s3.amazonaws.com/edx-course-videos/edx-edx101/EDXSPCPJSP13-H010000_100.mp4&quot;]" show_captions="true" source="" sub="name_of_file" track="" youtube_id_0_75="" youtube_id_1_0="b7xgknqkQk8" youtube_id_1_25="" youtube_id_1_5="">
            <source src="https://s3.amazonaws.com/edx-course-videos/edx-edx101/EDXSPCPJSP13-H010000_100.mp4"/>
        </video>
        */
        // this.display_name = this.$('title').text();
    }
}