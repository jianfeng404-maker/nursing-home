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
    const aTags = content.match(/<a\b[^>]*>([\s\S]*?)<\/a>/gi);
    if (aTags) {
      aTags.forEach(aTag => {
        const inner = aTag.substring(2);
        if(inner.match(/<(button|a)\b/gi)) {
          console.log("Found in a tag at " + filePath + ":\n" + aTag.substring(0, 50) + "...\n");
        }
      });
    }
  }
});
