const fs = require('fs');
const path = require('path');

const projectRoot = __dirname;
const srcPath = path.join(projectRoot, 'src');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith('.js') || file.endsWith('.jsx')) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });
  return arrayOfFiles;
}

const jsFiles = getAllFiles(srcPath);
const importRegex = /import\s+({?[\s\w,]*?}?)\s+from\s+['"](.*)['"]/g;

console.log(`Auditing ${jsFiles.length} files...`);

const results = [];

jsFiles.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const dirName = path.dirname(filePath);
  const relativeToSrc = path.relative(srcPath, filePath);

  lines.forEach((line, index) => {
    // Ignore commented lines
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('/*')) return;

    let m;
    importRegex.lastIndex = 0;
    while ((m = importRegex.exec(line)) !== null) {
      const importNames = m[1].replace(/[{}]/g, '').split(',').map(n => n.trim().split(' as ')[0]);
      const importPath = m[2];
      
      if (importPath.startsWith('.')) {
        const absolutePath = path.resolve(dirName, importPath);
        const extensions = ['', '.js', '.jsx', '.css', '.png', '.jpg', '.jpeg'];
        let found = false;
        
        for (const ext of extensions) {
          if (fs.existsSync(absolutePath + ext)) {
            found = true;
            break;
          }
        }

        if (!found) {
          // Check if any of the imported names are used in the file
          const otherLines = lines.slice(index + 1).join('\n');
          const usedNames = importNames.filter(name => {
            if (!name) return false;
            // Simple check: is the name present as a word?
            const wordRegex = new RegExp(`\\b${name}\\b`, 'g');
            // Check in the rest of the file
            const matches = content.match(wordRegex);
            // matches[0] is the import itself, so we need > 1
            return matches && matches.length > 1;
          });

          results.push({
            file: relativeToSrc,
            line: index + 1,
            importPath,
            names: importNames,
            used: usedNames,
            isUsed: usedNames.length > 0
          });
        }
      }
    }
  });
});

console.log('--- RELEVANT FAILURES (USED OR NOT IGNORED) ---');
results.forEach(res => {
    if (res.isUsed) {
        console.log(`[REAL FAIL] ${res.file}:${res.line} -> ${res.importPath} (Used: ${res.used.join(', ')})`);
    } else {
        console.log(`[UNUSED FAIL] ${res.file}:${res.line} -> ${res.importPath}`);
    }
});
