const fs = require('fs');
const src = fs.readFileSync('src/lib/countries.ts', 'utf8');
// extract COUNTRIES array block
const cStart = src.indexOf('export const COUNTRIES');
const cEnd = src.indexOf('];', cStart);
const cBlock = src.slice(cStart, cEnd);
const codes = [...cBlock.matchAll(/code: "([A-Z]{2})"/g)].map((m) => m[1]);
// extract DEMONYMS record keys
const dStart = src.indexOf('const DEMONYMS');
const dEnd = src.indexOf('};', dStart);
const dBlock = src.slice(dStart, dEnd);
const demonymKeys = new Set([...dBlock.matchAll(/([A-Z]{2}):/g)].map((m) => m[1]));
const missing = codes.filter((c) => !demonymKeys.has(c));
console.log('COUNTRIES count:', codes.length);
console.log('missing demonyms:', missing.length ? missing.join(', ') : 'none');
