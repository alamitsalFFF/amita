const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'src');

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

jsFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Fix Iconbutton: comment it out if it points to the missing file
  const iconbtnRegex = /^import\s+IconButton\s+from\s+['"].*Iconbutton['"];?\s*$/gm;
  if (iconbtnRegex.test(content)) {
    content = content.replace(iconbtnRegex, (match) => `// ${match.trim()}`);
    changed = true;
  }

  // Fix ScrollTop: comment it out
  const scrollTopRegex = /^import\s+ScrollTop\s+from\s+['"].*ScrollTop['"];?\s*$/gm;
  if (scrollTopRegex.test(content)) {
    content = content.replace(scrollTopRegex, (match) => `// ${match.trim()}`);
    changed = true;
  }

  // Fix ButtonPO/ButtonPR: comment them out
  const buttonPORegex = /^import\s+ButtonPO\s+from\s+['"].*ButtonPO['"];?\s*$/gm;
  if (buttonPORegex.test(content)) {
    content = content.replace(buttonPORegex, (match) => `// ${match.trim()}`);
    changed = true;
  }
  const buttonPRRegex = /^import\s+ButtonPR\s+from\s+['"].*ButtonPR['"];?\s*$/gm;
  if (buttonPRRegex.test(content)) {
    content = content.replace(buttonPRRegex, (match) => `// ${match.trim()}`);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${path.relative(srcPath, filePath)}`);
  }
});
