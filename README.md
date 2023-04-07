# pytree

[![NPM version][npm-image]][npm-url]
![npm-typescript]
[![License][github-license]][github-license-url]

## About

Pytree is a Node.js package that prints a tree of a Python project's directory structure with classes and methods. It provides an API that allows you to extract the classes and methods from your Python files, and then prints or saves a tree structure of your project's directory with those extracted classes and methods.

## Example

```js
import { runParse } from 'pytree';

// Print the tree structure of the current directory
runParse();

// Print the tree structure of the directory 'src'
runParse(['src']);

// Print the tree structure of the directories 'src' and 'tests',
// excluding any files or directories that match the regular expression /__pycache__/
runParse(['src', 'tests'], null, [/__pycache__/]);
```

## Installation

```bash
npm install pytree
```

or

```bash
yarn add pytree
```

## Usage

The `runParse()` function is the main entry point for the package. It takes the following arguments:

- `dirs` (optional, default=['.']): an array of directories to search for Python files.
- `outputFile` (optional): a file path to save the output to. If this argument is not provided, the output is printed to the console.
- `except` (optional, default=[]): an array of regular expressions to exclude files or directories.

## Usage (global module)

```sh

pytree --except "__init__.py" "test_*"

pytree --dest /path/to/output.txt

pytree --dir /path/to/directory1 /path/to/directory2

pytree

└─> file1.py
  └─> MyClass
    └─> my_method
  └─> MyOtherClass
    └─> my_other_method
```
## API

- **getClassAndMethodIndices(file: string): { classes: ClassInfo[]; methods: MethodInfo[]; }**
- **walkTree(currentPath: string, level: number, output: OutputEntry[], except: RegExpExecArray[]): void**
- **printOutput(output: OutputEntry[]): void**
- **saveOutput(output: OutputEntry[], filePath: string): void**
- **isPythonFile(filename: string): boolean**
- **runParse(dirs = [], outputFile = null, except = [])**

[package-name]: pytree
[npm-url]: https://www.npmjs.com/package/pytree
[npm-image]: https://img.shields.io/npm/v/pytree
[github-license]: https://img.shields.io/github/license/romankurnovskii/pytree
[github-license-url]: https://github.com/romankurnovskii/pytree/blob/main/LICENSE
[npm-typescript]: https://img.shields.io/npm/types/pytree
[build-status]: https://github.com/romankurnovskii/pytree/workflows/CI/badge.svg
