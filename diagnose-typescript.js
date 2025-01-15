const fs = require('fs');
const path = require('path');

function analyzeFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for mismatched braces
    const openBraces = (content.match(/{/g) || []).length;
    const closeBraces = (content.match(/}/g) || []).length;
    
    // Check for import statements
    const imports = content.match(/import\s+[^;]+;/g) || [];
    
    // Check for class and function definitions
    const classDefinitions = content.match(/class\s+\w+/g) || [];
    const functionDefinitions = content.match(/function\s+\w+/g) || [];
    
    return {
      file: path.basename(filePath),
      braceBalance: {
        open: openBraces,
        close: closeBraces,
        balanced: openBraces === closeBraces
      },
      importCount: imports.length,
      classCount: classDefinitions.length,
      functionCount: functionDefinitions.length
    };
  } catch (error) {
    return {
      file: path.basename(filePath),
      error: error.message
    };
  }
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
        const fileResults = analyzeFile(fullPath);
        results.push(fileResults);
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

console.log('TypeScript File Analysis:');
console.log(JSON.stringify(analysisResults, null, 2));