#!/usr/bin/env node
import { ArgumentParser } from 'argparse';
import { runParse } from './index.js'; // https://nodejs.org/api/esm.html#esm_mandatory_file_extensions

const parser = new ArgumentParser({
  description: 'Python file tree with methods',
});

parser.add_argument('-d', '--dir', {
  help: 'Directory to search for Python files',
  nargs: '*',
  default: ['.'],
});

parser.add_argument('--except', {
  help: 'Regular expression(s) to exclude files',
  nargs: '*',
  default: [],
});

parser.add_argument('--dest', {
  help: 'Destination file to save output',
  default: null,
});

const args = parser.parse_args();
const dirs = args.dir;
const except = args.except.map((pattern: string) => new RegExp(pattern));
const outputFile = args.dest;

runParse(dirs, outputFile, except);
