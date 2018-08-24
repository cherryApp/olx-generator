// Set argument parser.
const ArgumentParser = require('argparse').ArgumentParser;

var parser = new ArgumentParser({
    version: '0.0.1',
    addHelp: true,
    description: 'Usage'
  });
parser.addArgument(
    [ '-u', '--url' ],
    {
      help: 'the url that will convert to olx',
      required: true
    }
  );
parser.addArgument(
    [ '-head', '--header' ],
    {
      help: 'http header, for example: cookie',
      required: false
    }
  );

const parseHeaders = headers => {
    let head = {};
    headers = headers.split('|');
    if (headers.length === 2) {
        head[headers[0]] = headers[1];
    }
    return head;
};

let args = parser.parseArgs();
if (args.header) {
    args.header = parseHeaders(args.header);
}
module.exports = args;
