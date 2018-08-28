const http = require('http'),
    path = require('path'),
    args = require('./module/parser'),
    OlxGenerator = require('./module/olxGenerator');

// Check url.
if (!args.url) {
    console.error('Please give the url!');
    process.exit(1);
}

// Add urls.
args.urls = ["https://yellowroad.training360.com/lesson/basic/week2/02_char_coding",
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
    "https://yellowroad.training360.com/lesson/basic/week2/10_variable_types_object",
    "https://yellowroad.training360.com/lesson/basic/week1/01_command_line",
    "https://yellowroad.training360.com/lesson/basic/week1/02_folders",
    "https://yellowroad.training360.com/lesson/basic/week1/11_source_control_basics",
    "https://yellowroad.training360.com/lesson/basic/week1/12_git_basics",
    "https://yellowroad.training360.com/lesson/basic/week1/13_git_install",
    "https://yellowroad.training360.com/lesson/basic/week1/14_git_config",
    "https://yellowroad.training360.com/lesson/basic/week1/15_git_init",
    "https://yellowroad.training360.com/lesson/basic/week1/16_git_clone",
    "https://yellowroad.training360.com/lesson/basic/week1/17_git_status",
    "https://yellowroad.training360.com/lesson/basic/week1/18_git_remote",
    "https://yellowroad.training360.com/lesson/basic/week1/19_github",
    "https://yellowroad.training360.com/lesson/basic/week1/20_git_revert",
    "https://yellowroad.training360.com/lesson/basic/week1/21_git_reset",
    "https://yellowroad.training360.com/lesson/basic/week1/22_git_log",
    "https://yellowroad.training360.com/lesson/basic/week1/23_git_diff",
    "https://yellowroad.training360.com/lesson/basic/week1/24_git_status",
    "https://yellowroad.training360.com/lesson/basic/week1/26_git_grep",
    "https://yellowroad.training360.com/lesson/basic/week1/27_git_branch",
    "https://yellowroad.training360.com/lesson/basic/week1/29_git_merge",
    "https://yellowroad.training360.com/lesson/basic/week1/30_git_conflict",
    "https://yellowroad.training360.com/lesson/basic/week3/07_loops_for",
    "https://yellowroad.training360.com/lesson/basic/week3/01_css_basic_selectors",
    "https://yellowroad.training360.com/lesson/basic/week3/10_loops_forin",
    "https://yellowroad.training360.com/lesson/basic/week3/05_css_selector_advanced",
    "https://yellowroad.training360.com/lesson/basic/week3/09_loops_while",
    "https://yellowroad.training360.com/lesson/basic/week3/02_css_colors",
    "https://yellowroad.training360.com/lesson/basic/week3/03_statement_if",
    "https://yellowroad.training360.com/lesson/basic/week3/14_css_box_model",
    "https://yellowroad.training360.com/lesson/basic/week3/04_statement_switch",
    "https://yellowroad.training360.com/lesson/basic/week3/06_css_fonts",
    "https://yellowroad.training360.com/lesson/basic/week3/08_algorithm_intro",
    "https://yellowroad.training360.com/lesson/basic/week3/11_algorithms_basic",
    "https://yellowroad.training360.com/lesson/basic/week3/12_logic_search",
    "https://yellowroad.training360.com/lesson/basic/week3/17_logic_sort",
    "https://yellowroad.training360.com/lesson/basic/week3/13_sort_replace",
    "https://yellowroad.training360.com/lesson/basic/week3/17_algorithms_sum_count",
    "https://yellowroad.training360.com/lesson/basic/week3/18_algorithms_min_dec",
    "https://yellowroad.training360.com/lesson/basic/week3/18_logic_replace_order",
    "https://yellowroad.training360.com/lesson/basic/week3/17_css_transition",
    "https://yellowroad.training360.com/lesson/basic/week3/18_css_animation",
    "https://yellowroad.training360.com/lesson/basic/week3/19_css_media_query",
    "https://yellowroad.training360.com/lesson/basic/week3/20_css_forms",
    "https://yellowroad.training360.com/lesson/basic/week4/21_dom_query",
    "https://yellowroad.training360.com/lesson/basic/week4/21_javascript_function",
    "https://yellowroad.training360.com/lesson/basic/week4/22_dom_attributes",
    "https://yellowroad.training360.com/lesson/basic/week4/22_javascript_func_params",
    "https://yellowroad.training360.com/lesson/basic/week4/23_dom_loops",
    "https://yellowroad.training360.com/lesson/basic/week4/23_javascript_func_scope",
    "https://yellowroad.training360.com/lesson/basic/week4/24_dom_element",
    "https://yellowroad.training360.com/lesson/basic/week4/24_javascript_json",
    "https://yellowroad.training360.com/lesson/basic/week4/25_dom_html_value",
    "https://yellowroad.training360.com/lesson/basic/week4/25_javascript_array_methods",
    "https://yellowroad.training360.com/lesson/basic/week4/26_dom_style",
    "https://yellowroad.training360.com/lesson/basic/week4/26_javascript_date",
    "https://yellowroad.training360.com/lesson/basic/week4/27_dom_child",
    "https://yellowroad.training360.com/lesson/basic/week4/27_dom_events",
    "https://yellowroad.training360.com/lesson/basic/week4/28_dom_handle_children",
    "https://yellowroad.training360.com/lesson/basic/week4/28_class_basic",
    "https://yellowroad.training360.com/lesson/basic/week4/28_class_extend",
    "https://yellowroad.training360.com/lesson/basic/week4/28_clean_code",
    "https://yellowroad.training360.com/lesson/basic/week4/28_dom_drag_drop",
    "https://yellowroad.training360.com/lesson/basic/week4/29_dom_multimedia",
    "https://yellowroad.training360.com/lesson/basic/week4/29_dom_video_player",
    "https://yellowroad.training360.com/lesson/basic/week4/30_dom_animated_header",
    "https://yellowroad.training360.com/lesson/basic/week6/01_sql_install",
    "https://yellowroad.training360.com/lesson/basic/week6/02_sql_intro",
    "https://yellowroad.training360.com/lesson/basic/week6/03_sql_select",
    "https://yellowroad.training360.com/lesson/basic/week6/04_sql_where",
    "https://yellowroad.training360.com/lesson/basic/week6/05_sql_and_or_not",
    "https://yellowroad.training360.com/lesson/basic/week6/06_sql_order_by",
    "https://yellowroad.training360.com/lesson/basic/week6/07_sql_insert",
    "https://yellowroad.training360.com/lesson/basic/week6/08_sql_update",
    "https://yellowroad.training360.com/lesson/basic/week6/09_sql_delete",
    "https://yellowroad.training360.com/lesson/basic/week6/10_sql_min_max",
    "https://yellowroad.training360.com/lesson/basic/week6/11_sql_count_avg_sum",
    "https://yellowroad.training360.com/lesson/basic/week6/12_sql_group_by",
    "https://yellowroad.training360.com/lesson/basic/week6/13_sql_like",
    "https://yellowroad.training360.com/lesson/basic/week6/14_sql_joins",
    "https://yellowroad.training360.com/lesson/basic/week6/15_sql_keys",
    "https://yellowroad.training360.com/lesson/basic/week6/16_sql_auto_increment",
    "https://yellowroad.training360.com/lesson/basic/week6/17_sql_union"];

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
let courseDirectory = path.join(__dirname, 'olx/test1');
const course = new OlxGenerator(courseData, courseDirectory, args);
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
