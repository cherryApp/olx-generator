const http = require('http'),
    path = require('path'),
    args = require('./module/parser'),
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
    url_name: "training360-basic-course",
    org: "Training360",
    course: "Bevezetés a programozásba",
    advanced_modules: "[&quot;annotatable&quot;, &quot;videoalpha&quot;, &quot;openassessment&quot;]", 
    cert_html_view_enabled: "true",
    display_name: "Programozási alapismeretek", 
    language: "hu",
    start: "&quot;2018-09-01T00:00:00+00:00&quot;"
};

courseData.chapters = [
    {
        display_name: "HTML, CSS, JS - tartalom, stílus, dinamika",
        urls: ["https://yellowroad.training360.com/lesson/basic/week2/02_char_coding",
        "https://yellowroad.training360.com/lesson/basic/week2/01_html_basic",
        "https://yellowroad.training360.com/lesson/basic/week2/01_variable_basics",
        "https://yellowroad.training360.com/lesson/basic/week2/02_html_block_elements",
        "https://yellowroad.training360.com/lesson/basic/week2/02_variable_as_object",
        "https://yellowroad.training360.com/lesson/basic/week2/03_html_lists",
        "https://yellowroad.training360.com/lesson/basic/week2/03_variable_types_number",
        "https://yellowroad.training360.com/lesson/basic/week2/04_html_form",
        "https://yellowroad.training360.com/lesson/basic/week2/04_variable_types_number_methods",
        "https://yellowroad.training360.com/lesson/basic/week2/05_html_check_radio",
        "https://yellowroad.training360.com/lesson/basic/week2/05_variable_types_string",
        "https://yellowroad.training360.com/lesson/basic/week2/06_html_select",
        "https://yellowroad.training360.com/lesson/basic/week2/06_variable_types_string_methods",
        "https://yellowroad.training360.com/lesson/basic/week2/07_html_form_full",
        "https://yellowroad.training360.com/lesson/basic/week2/07_variable_types_boolean",
        "https://yellowroad.training360.com/lesson/basic/week2/08_variable_types_array",
        "https://yellowroad.training360.com/lesson/basic/week2/08_html_table",
        "https://yellowroad.training360.com/lesson/basic/week2/09_html_links",
        "https://yellowroad.training360.com/lesson/basic/week2/09_variable_types_array_methods",
        "https://yellowroad.training360.com/lesson/basic/week2/10_html_resources",
        "https://yellowroad.training360.com/lesson/basic/week2/10_variable_types_object"
        ]
    }
];

let courseDirectory = path.join(__dirname, 'olx/tr3600012');
const course = new OlxGenerator(courseData, courseDirectory, args);
