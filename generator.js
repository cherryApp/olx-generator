const http = require('http'),
    path = require('path'),
    args = require('./module/parser'),
    got = require('got'),
    OlxGenerator = require('./module/olxGenerator');

// Check url.
if (!args.url) {
    console.error('Please give the url!');
    process.exit(1);
}

// Use this with cookie hack.
// node generator -u 'https://yellowroad.training360.com/lesson/basic/week2/02_char_coding' -head 'cookie|YellowSSO=B9pUg7YBQFdvKY5nKutfgiWgh0VWf0qkDa68Dp0XTrNqGjhm3DgD8tT9vGRnaRTbAi/WqqJ3nH10saiGz4GoyYTmGGHKMF0HARQ7FVLX3cip4h8A49djwTUqGim04UJncw2R87cmm0jOnTSnbaYkxnbPJ4L1c+MT4iwqIIrt/q1kqsejGp24x0ONCgIawEfEw+0HHLE9HDU2TqeE+NndFld8KIUp5uwrcCxUdmLO/Uvpfv5UvxE7VY9CGjTgRxQjYWNVe7w1AaGKD3GtokSNEQ==;'

// Init course.
let courseData = {
    "url_name": "course",
    "org": "edX",
    "course": "DemoX"    
};
const course = new OlxGenerator(courseData);
/*
// Get content from the url.
const client = got.extend({
    baseUrl: args.url,
    headers: args.header,
    encoding: 'utf8'
});
client.get('/').then(
    data => processContent(data),
    err => console.error(err)
);

// Process content.
const processContent = data => {
    let body = data.body;
    let gen = new OlxGenerator(body);
};
*/
