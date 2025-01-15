const fs = require('fs');
const path = require('path');

const sourceDirs = [
  'src/functions',
  'src/functions/content'
];

function addMinimalTypeSafety(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Minimal type safety additions
    const safeguardUtilities = `
// Minimal type safety utilities
function safeGet<T>(obj: any, path: string, defaultValue?: T): T | undefined {
  return path.split('.').reduce((acc, part) => 
    acc && acc[part] !== undefined ? acc[part] : defaultValue, obj);
}

function ensureArray<T>(value: T | T[] | null | undefined): T[] {
  if (value === null || value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}
`;

    // Add utilities before the first import or at the top of the file
    const importMatch = content.match(/^(import\s+[^\n]+\n)+/);
    if (importMatch) {
      content = importMatch[0] + safeguardUtilities + content.slice(importMatch[0].length);
    } else {
      content = safeguardUtilities + content;
    }

    fs.writeFileSync(filePath, content);
    console.log(`Added minimal type safety to ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.ts')) {
      addMinimalTypeSafety(fullPath);
    }
  });
}

sourceDirs.forEach(processDirectory);

console.log('Minimal type safety update complete.');