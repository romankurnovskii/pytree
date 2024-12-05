import * as fs from 'node:fs';
import * as path from 'node:path';

interface ClassInfo {
  name: string;
  index: number;
}

interface MethodInfo {
  name: string;
  index: number;
}

interface OutputEntry {
  level: number;
  type: 'dir' | 'file' | 'class' | 'method';
  name: string;
}

export function getClassAndMethodIndices(file: string): {
  classes: ClassInfo[];
  methods: MethodInfo[];
  content: string;
} {
  const content = fs.readFileSync(file, 'utf8');
  const classRegex = /^\s*class\s+(\w+)/gm;
  const methodRegex = /^\s*def\s+(\w+)\s*\(/gm;
  const asyncMmethodRegex = /^\s*async def\s+(\w+)\s*\(/gm;

  let classMatch: RegExpExecArray | null;
  let methodMatch: RegExpExecArray | null;
  const classes: ClassInfo[] = [];
  const methods: MethodInfo[] = [];

  while ((classMatch = classRegex.exec(content)) !== null) {
    classes.push({ name: classMatch[1], index: classMatch.index });
  }

  while ((methodMatch = methodRegex.exec(content)) !== null) {
    methods.push({ name: methodMatch[1], index: methodMatch.index });
  }

  while ((methodMatch = asyncMmethodRegex.exec(content)) !== null) {
    methods.push({ name: methodMatch[1], index: methodMatch.index });
  }

  return { classes, methods, content };
}

function getLine(
  content: string,
  indexStart: number,
  indexEnd: number
): string {
  const lineStart = content.lastIndexOf('\n', indexStart - 1) + 1;
  const lineEnd = content.indexOf('\n', indexEnd);
  const line = content.substring(
    lineStart,
    lineEnd !== -1 ? lineEnd : undefined
  );
  return line;
}

export function walkTree(
  currentPath: string,
  level: number,
  output: OutputEntry[],
  except: RegExpExecArray[]
): void {
  fs.readdirSync(currentPath).forEach(name => {
    const filePath = path.join(currentPath, name);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!except.some((re: any) => re.test(filePath))) {
        output.push({ level, type: 'dir', name });
        walkTree(filePath, level + 1, output, except);
      }
    } else if (
      stat.isFile() &&
      isPythonFile(name) &&
      !except.some((re: any) => re.test(filePath))
    ) {
      output.push({ level, type: 'file', name });
      const { classes, methods, content } = getClassAndMethodIndices(filePath);

      // Find the index of the first class
      let firstClassIndex = classes.length > 0 ? classes[0].index : Infinity;

      classes.forEach((classInfo, classIdx) => {
        output.push({ level: level + 1, type: 'class', name: classInfo.name });
        const classStart = classInfo.index;
        const classEnd = classes[classIdx + 1]?.index || Infinity;

        // calculate class indentation level
        const classLine = getLine(content, classStart, classEnd);
        let classIndent = classLine.search(/\S/);
        classIndent = Math.floor(classIndent / 4); // tab indent = 4 spaces

        // let prevMethodStart = 0;
        // let prevMethodLevel = level + 2;
        methods.forEach((methodInfo, methodIdx) => {
          if (methodInfo.index > classStart && methodInfo.index < classEnd) {
            const methodStart = methodInfo.index;
            const methodEnd = classes[methodIdx + 1]?.index || Infinity;

            // calculate method indentation level
            const methodLine = getLine(content, methodStart, methodEnd);
            let methodIndent = methodLine.search(/\S/);
            methodIndent = Math.floor(methodIndent / 4); // tab indent = 4 spaces

            const methodLevel = level + 1 + classIndent + methodIndent;
            output.push({
              level: methodLevel,
              type: 'method',
              name: methodInfo.name,
            });
          }

          // Update firstClassIndex if necessary
          if (methodInfo.index < firstClassIndex) {
            firstClassIndex = methodInfo.index;
          }
        });
      });

      // Check if there are any methods before the first class
      methods.forEach(methodInfo => {
        if (methodInfo.index <= firstClassIndex) {
          output.push({
            level: level + 1,
            type: 'method',
            name: methodInfo.name,
          });
        }
      });
    }
  });
}

export function printOutput(output: OutputEntry[]): void {
  output.forEach(({ level, type, name }) => {
    const prefix = '  '.repeat(level) + (type === 'dir' ? '├─> ' : '└─> ');
    console.log(prefix + name);
  });
}

export function saveOutput(output: OutputEntry[], filePath: string): void {
  const lines = output.map(({ level, type, name }) => {
    const prefix = '  '.repeat(level) + (type === 'dir' ? '├─> ' : '└─> ');
    return prefix + name;
  });
  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
}

export function isPythonFile(filename: string): boolean {
  return filename.endsWith('.py');
}

export function runParse(dirs: string[] = [], except = []) {
  let output: OutputEntry[] = [];
  dirs.forEach((dir: string) => {
    const dirOutput: OutputEntry[] = [];
    walkTree(dir, 0, dirOutput, except);
    output = output.concat(dirOutput);
  });
  return output;
}

export function run(dirs: string[] = [], outputFile = null, except = []) {
  const output = runParse(dirs, except);
  if (outputFile) {
    saveOutput(output, outputFile);
  } else {
    printOutput(output);
  }
}
