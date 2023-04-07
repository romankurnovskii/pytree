import * as fs from 'fs';
import * as path from 'path';

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
} {
  const content = fs.readFileSync(file, 'utf8');
  const classRegex = /^\s*class\s+(\w+)/gm;
  const methodRegex = /^\s*def\s+(\w+)\s*\(/gm;

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

  return { classes, methods };
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
      const { classes, methods } = getClassAndMethodIndices(filePath);

      classes.forEach((classInfo, classIdx) => {
        output.push({ level: level + 1, type: 'class', name: classInfo.name });
        const classStart = classInfo.index;
        const classEnd = classes[classIdx + 1]?.index || Infinity;

        methods.forEach(methodInfo => {
          if (methodInfo.index > classStart && methodInfo.index < classEnd) {
            output.push({
              level: level + 2,
              type: 'method',
              name: methodInfo.name,
            });
          }
        });
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

export function runParse(dirs: string[] = [], outputFile = null, except = []) {
  dirs.forEach((dir: string) => {
    const output: OutputEntry[] = [];
    walkTree(dir, 0, output, except);

    if (outputFile) {
      saveOutput(output, outputFile);
    } else {
      printOutput(output);
    }
  });
}
