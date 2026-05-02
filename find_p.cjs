const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
    const content = fs.readFileSync(filePath, 'utf8');
    const pTags = content.match(/<p\b[^>]*>([\s\S]*?)<\/p>/gi);
    if (pTags) {
      pTags.forEach(pTag => {
        if (pTag.match(/<(div|h[1-6]|ul|ol|li|table|form|fieldset|nav)\b/i)) {
          console.log("Found in " + filePath + ":\n" + pTag + "\n");
        }
      });
    }
  }
});
