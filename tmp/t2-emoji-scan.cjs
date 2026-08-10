const fs = require('fs');
const path = require('path');
const dirs = ['src/app', 'src/components'];
const re = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
let total = 0;
function walk(d) {
  for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, ent.name);
    if (ent.isDirectory()) walk(p);
    else if (/\.(tsx|jsx|ts|js)$/.test(ent.name)) {
      const src = fs.readFileSync(p, 'utf8');
      if (re.test(src)) {
        const lines = src.split('\n');
        lines.forEach((ln, i) => {
          if (re.test(ln)) {
            total++;
            console.log(p + ':' + (i + 1) + ': ' + ln.trim().slice(0, 120));
          }
        });
      }
    }
  }
}
dirs.forEach(walk);
console.log('TOTAL_MATCHES=' + total);
