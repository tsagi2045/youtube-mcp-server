const fs = require('fs');
const path = require('path');

const sourceDirs = [
  'src/functions',
  'src/functions/content'
];

function cleanupFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove duplicate function implementations
  content = content.replace(
    /function\s+(\w+)\s*\([^)]*\)\s*{[^}]*}\s*function\s+\1\s*\([^)]*\)\s*{[^}]*}/g, 
    (match, funcName) => {
      console.log(`Removed duplicate implementation of ${funcName}`);
      return match.split(/function\s+\w+\s*\([^)]*\)\s*{[^}]*}/)[0];
    }
  );

  // Standardize imports
  const importCleaning = [
    // Remove old typescript-sdk imports
    [/import\s+{\s*[^}]*}\s+from\s+['"]@modelcontextprotocol\/typescript-sdk['"];?/g, ''],
    
    // Ensure MCP SDK import
    [/import\s+{\s*([^}]+)\s*}\s+from\s+['"]@modelcontextprotocol\/sdk['"];?/g, 
      (match, imports) => `import { ${imports.trim()} } from '@modelcontextprotocol/sdk';`],
    
    // Standardize module imports
    [/import\s*(\w+)\s+from\s+['"]youtube-transcript['"];?/g, 
      'import { YoutubeTranscript } from "youtube-transcript";'],
    
    // Add missing SDK import if not present
    [/^(import\s+[^\n]+\n)/m, 
      (match) => `import { MCPFunction, MCPFunctionGroup } from '@modelcontextprotocol/sdk';\n${match}`]
  ];

  importCleaning.forEach(([regex, replacement]) => {
    content = content.replace(regex, replacement);
  });

  // Remove duplicate or redundant imports
  content = content.replace(/^(import\s+[^;]+;)\s*\1/gm, '$1');

  fs.writeFileSync(filePath, content);
  console.log(`Processed file: ${filePath}`);
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.ts')) {
      cleanupFile(fullPath);
    }
  });
}

sourceDirs.forEach(processDirectory);

console.log('Import and duplicate cleanup complete.');