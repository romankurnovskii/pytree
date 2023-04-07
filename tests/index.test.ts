import * as path from 'path';

import { isPythonFile, walkTree } from '../src/index';

describe('Init test', () => {
  it('verify isPythonFile function', () => {
    const expected = false;
    const result = isPythonFile('file.txt');
    expect(result).toBe(expected);
  });
});

describe('walkTree', () => {
  it('should output correct tree structure for a given directory', () => {
    const testDir = path.join(__dirname, 'test_dir');
    const output: any[] = [];
    const expectedOutput = [
      { level: 0, type: 'file', name: 'file1.py' },
      { level: 1, type: 'class', name: 'MyClass' },
      { level: 2, type: 'method', name: 'my_method' },
      { level: 1, type: 'class', name: 'MyOtherClass' },
      { level: 2, type: 'method', name: 'my_other_method' },
    ];

    walkTree(testDir, 0, output, []);
    expect(output).toEqual(expectedOutput);
  });
});
