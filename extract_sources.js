const fs = require('fs');
const path = require('path');

const mapFiles = [
  './build/static/js/453.6bbb2f34.chunk.js.map',
  './build/static/js/main.dfd5a77c.js.map',
  './build/static/css/main.7a1b7e68.css.map',
];

const outputDir = './recovered_src';

function extractSourcesFromMap(mapFilePath) {
  console.log(`\nProcessing: ${mapFilePath}`);
  const raw = fs.readFileSync(mapFilePath, 'utf8');
  const map = JSON.parse(raw);

  const sources = map.sources || [];
  const sourcesContent = map.sourcesContent || [];

  console.log(`Found ${sources.length} source files.`);

  sources.forEach((src, i) => {
    const content = sourcesContent[i];
    if (!content) return;

    // Clean up the source path
    let cleanPath = src
      .replace(/^webpack:\/\/\//g, '')
      .replace(/^webpack:\/\//g, '')
      .replace(/^\.\//g, '')
      .replace(/^src\//g, 'src/')
      .replace(/\?.*$/, ''); // remove query strings

    // Skip node_modules
    if (cleanPath.includes('node_modules')) return;

    const outPath = path.join(outputDir, cleanPath);
    const outDir = path.dirname(outPath);

    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    fs.writeFileSync(outPath, content, 'utf8');
    console.log(`  Recovered: ${cleanPath}`);
  });
}

mapFiles.forEach(f => {
  if (fs.existsSync(f)) {
    extractSourcesFromMap(f);
  } else {
    console.log(`File not found: ${f}`);
  }
});

console.log(`\nDone! Recovered files are in: ${path.resolve(outputDir)}`);
