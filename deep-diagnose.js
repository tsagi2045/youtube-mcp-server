const fs = require('fs');
const path = require('path');
const ts = require('typescript');

function analyzeTypeScriptFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  
  const sourceFile = ts.createSourceFile(
    filePath, 
    fileContent, 
    ts.ScriptTarget.Latest, 
    true
  );

  const syntaxErrors = [];
  
  function findSyntaxErrors(node) {
    if (ts.getLineAndCharacterOfPosition) {
      const issues = ts.getLineAndCharacterOfPosition(sourceFile, node.pos);
      syntaxErrors.push({
        line: issues.line + 1,
        character: issues.character,
        message: 'Syntax issue detected'
      });
    }
    ts.forEachChild(node, findSyntaxErrors);
  }

  findSyntaxErrors(sourceFile);

  return {
    file: path.basename(filePath),
    syntaxErrors: syntaxErrors
  };
}

function processDirectory(dir) {
  const results = [];
  
  function traverseDir(currentPath) {
    const files = fs.readdirSync(currentPath);
    
    files.forEach(file => {
      const fullPath = path.join(currentPath, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverseDir(fullPath);
      } else if (file.endsWith('.ts')) {
        const fileResults = analyzeTypeScriptFile(fullPath);
        if (fileResults.syntaxErrors.length > 0) {
          results.push(fileResults);
        }
      }
    });
  }
  
  traverseDir(dir);
  return results;
}

const sourceDirs = [
  'src/functions',
  'src/functions/content'
];

const analysisResults = sourceDirs.flatMap(dir => 
  processDirectory(path.join(__dirname, dir))
);

console.log('Detailed TypeScript Syntax Analysis:');
console.log(JSON.stringify(analysisResults, null, 2));