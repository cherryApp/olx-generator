// Set argument parser.
const ArgumentParser = require('argparse').ArgumentParser;

var parser = new ArgumentParser({
    version: '0.0.1',
    addHelp: true,
    description: 'Usage'
  });
parser.addArgument(
    [ '-j', '--json' ],
    {
      help: 'the path of json file, it contains the settings',
      required: true
    }
  );

let args = parser.parseArgs();
module.exports = args;
