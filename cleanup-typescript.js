const fs = require('fs');
const path = require('path');
const ts = require('typescript');

function cleanupTypeScriptFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Create a TypeScript source file
  const sourceFile = ts.createSourceFile(
    filePath, 
    content, 
    ts.ScriptTarget.Latest, 
    true
  );

  // Check for syntax errors
  const diagnostics = ts.getPreEmitDiagnostics(sourceFile);
  
  if (diagnostics.length > 0) {
    console.log(`Potential syntax issues in ${path.basename(filePath)}:`);
    diagnostics.forEach(diagnostic => {
      const message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText, 
        '\n'
      );
      console.log(message);
    });
  }

  // Basic cleanup rules
  const cleanupRules = [
    // Remove duplicate imports
    [/^(import\s+[^\n]+;)(\s*\1)+/gm, '$1'],
    
    // Standardize MCP SDK import
    [/import\s+{\s*[^}]*}\s+from\s+['"]@modelcontextprotocol\/typescript-sdk['"];?/g, 
      'import { MCPFunction, MCPFunctionGroup } from "@modelcontextprotocol/sdk";'],
    
    // Standardize YouTube Transcript import
    [/import\s+(\w+)\s+from\s+['"]youtube-transcript['"];?/g, 
      'import { YoutubeTranscript } from "youtube-transcript";']
  ];

  cleanupRules.forEach(([regex, replacement]) => {
    content = content.replace(regex, replacement);
  });

  // Ensure consistent imports
  const requiredImports = [
    'import { MCPFunction, MCPFunctionGroup } from "@modelcontextprotocol/sdk";',
    'import { YoutubeTranscript } from "youtube-transcript";',
    'import * as ytdl from "ytdl-core";',
    'import * as fs from "fs/promises";'
  ];

  // Prepend imports if not present
  requiredImports.forEach(requiredImport => {
    if (!content.includes(requiredImport)) {
      content = requiredImport + '\n' + content;
    }
  });

  // Remove excessive whitespace and empty lines
  content = content.replace(/\n{3,}/g, '\n\n');
  content = content.replace(/^\s*[\r\n]/gm, '');

  fs.writeFileSync(filePath, content);
  console.log(`Processed file: ${path.basename(filePath)}`);
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.ts')) {
      cleanupTypeScriptFile(fullPath);
    }
  });
}

const sourceDirs = [
  'src/functions',
  'src/functions/content'
];

sourceDirs.forEach(sourcePath => processDirectory(
  path.join(__dirname, sourcePath)
));

console.log('TypeScript cleanup complete.');