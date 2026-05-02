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
    const bTags = content.match(/<button\b[^>]*>([\s\S]*?)<\/button>/gi);
    if (bTags) {
      bTags.forEach(bTag => {
        if (bTag.match(/<(button|a)\b/i) && bTag.match(/<(button|a)\b/i).index > 5) {
           // We might match the exact start tag, so index > 5 means nested
           const inner = bTag.substring(7); // skip `<button`
           if(inner.match(/<(button|a)\b/gi)) {
             console.log("Found button in button at " + filePath + ":\n" + bTag.substring(0, 50) + "...\n");
           }
        }
      });
    }
  }
});
