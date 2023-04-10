import * as path from 'path';

import { isPythonFile, runParse, walkTree } from '../src/index';

describe('Init test', () => {
  it('verify isPythonFile function', () => {
    const expected = false;
    const result = isPythonFile('file.txt');
    expect(result).toBe(expected);
  });
});

const expectedOutput = new Set([
  { level: 0, type: 'file', name: 'file1.py' },
  { level: 1, type: 'class', name: 'MyClass' },
  { level: 2, type: 'method', name: 'my_method' },
  { level: 2, type: 'method', name: 'method_and_child' },
  { level: 3, type: 'method', name: 'child_method' },
  { level: 1, type: 'method', name: 'fucntion_in_the_middle_of_classes' },
  { level: 1, type: 'class', name: 'MyOtherClass' },
  { level: 2, type: 'method', name: 'my_other_method' },
  { level: 2, type: 'method', name: 'my_other_async_method' },
  { level: 1, type: 'method', name: 'some_function_01' },
  { level: 1, type: 'method', name: 'some_function_02' },
  { level: 1, type: 'method', name: 'some_function_03' },
  { level: 2, type: 'method', name: 'some_inner_function' },
]);

describe('walkTree', () => {
  it('should output correct tree structure for a given directory', () => {
    const testDir = path.join(__dirname, 'test_dir');
    const output: any[] = [];

    walkTree(testDir, 0, output, []);
    const outputSet = new Set(output);
    expect(outputSet).toEqual(expectedOutput);
  });
});

describe('runParse', () => {
  it('should return correct tree structure for a given directory', () => {
    const testDir = path.join(__dirname, 'test_dir');
    const output = runParse([testDir], []);
    const outputSet = new Set(output);
    expect(outputSet).toEqual(expectedOutput);
  });
});
