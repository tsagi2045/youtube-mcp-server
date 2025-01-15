const fs = require('fs');
const path = require('path');

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  const issues = [];

  // Check for potential SDK import issues
  const sdkImportRegex = /import\s+{[^}]*}\s+from\s+['"]@modelcontextprotocol\/sdk['"]/;
  if (!sdkImportRegex.test(content)) {
    issues.push('Missing or incorrect MCP SDK import');
  }

  // Check for typescript-specific issues
  const duplicateFunctionRegex = /function\s+(\w+)\s*\([^)]*\)\s*{[^}]*}\s*function\s+\1\s*\([^)]*\)\s*{[^}]*}/g;
  const duplicateFunctions = content.match(duplicateFunctionRegex);
  if (duplicateFunctions) {
    issues.push(`Duplicate function implementations: ${duplicateFunctions.length}`);
  }

  // Check for unresolved type references
  const unresolvedTypeRegex = /:\s*any\b|\bany\s*=/g;
  const unresolvedTypes = content.match(unresolvedTypeRegex);
  if (unresolvedTypes) {
    issues.push(`Unresolved type references: ${unresolvedTypes.length}`);
  }

  return {
    file: path.basename(filePath),
    issues: issues
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
        const fileResults = analyzeFile(fullPath);
        if (fileResults.issues.length > 0) {
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

console.log('Detailed Error Analysis:');
console.log(JSON.stringify(analysisResults, null, 2));