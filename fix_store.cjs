const fs = require('fs');
let code = fs.readFileSync('src/store/index.ts', 'utf-8');

// We need to inject toast
if (!code.includes("import { toast } from 'react-hot-toast';")) {
  if (code.includes("import  toast  from 'react-hot-toast';")) {
     // present
  } else {
     code = "import { toast } from 'react-hot-toast';\n" + code;
  }
}

// Simple logic: convert optimistic to pessimistic
// Wait, regex might destroy something. Let's try to match specifically.
// e.g., set((state) => ({ elders: state.elders.map(...) })); \n try { await fetch(...) } ...

// Actually, since there are so many, it's safer to provide a wrapper around `fetch` natively in window, but that wouldn't revert the state.

fs.writeFileSync('src/store/index.ts', code);
