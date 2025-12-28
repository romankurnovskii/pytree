#!/usr/bin/env node
import {Command} from 'commander';
import {run} from './index.js'; // https://nodejs.org/api/esm.html#esm_mandatory_file_extensions

const program = new Command();

program
  .name('pytree')
  .description('Python file tree with methods')
  .option('-d, --dir [dirs...]', 'Directory to search for Python files', '.')
  .option('--except [patterns...]', 'Regular expression(s) to exclude files', [])
  .option('--dest <file>', 'Destination file to save output')
  .parse();

const options = program.opts();
const dirs = Array.isArray(options.dir) ? options.dir : [options.dir || '.'];
const except = (Array.isArray(options.except) ? options.except : []).map(
  (pattern: string) => new RegExp(pattern),
);
const outputFile = options.dest || null;

run(dirs, outputFile, except);
