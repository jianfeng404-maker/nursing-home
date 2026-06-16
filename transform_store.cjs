const fs = require('fs');

let code = fs.readFileSync('src/store/index.ts', 'utf-8');

// Inject toast if needed
if (!code.includes("import { toast } from")) {
    code = "import { toast } from 'react-hot-toast';\n" + code;
}

// Regex to capture simple set + fetch pattern
const regex = /([a-zA-Z0-9_]+)\:\s*async\s*\((.*?)\)\s*=>\s*\{([\s\S]*?)set\(\((state)\)\s*=>\s*(\([\s\S]*?\))\);([\s\S]*?)try\s*\{\s*(const\s+[a-zA-Z0-9_]+\s*=\s*)?await\s*fetch\(([\s\S]*?)\);\s*\}([\s\S]*?catch\s*\((.*?)\)\s*\{[^\}]*Failed to sync[^\}]*\})\s*\}/gm;

// We will replace it with:
code = code.replace(regex, (match, methodName, args, beforeSet, stateVar, setBody, between, fetchAssignment, fetchArgs, catchBlock, errVar) => {
    return `${methodName}: async (${args}) => {${beforeSet}
    try {
      ${fetchAssignment || 'const res = '}await fetch(${fetchArgs});
      if (!res.ok) throw new Error('API Sync Failed');
      set((${stateVar}) => ${setBody});${between}
    } catch(${errVar}) {
      toast.error('操作失败: ' + ${errVar}.message);
      console.error('Failed to sync ${methodName}', ${errVar});
    }
  }`;
});

// Also there are some `.catch(...)` in inline fetches
const catchRegex = /\.catch\((.*?)\s*=>\s*console\.error\([^,]+,\s*\w+\)\)/gm;
code = code.replace(catchRegex, `.catch($1 => { toast.error('操作失败'); console.error($1); })`);

// Some other fetch without res.ok:
// We may want to add res.ok check to other places, but let's see.

fs.writeFileSync('src/store/index.ts', code);
