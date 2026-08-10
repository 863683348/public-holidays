const fs = require('fs');
const src = fs.readFileSync('src/lib/countries.ts', 'utf8');
const cStart = src.indexOf('export const COUNTRIES');
const cEnd = src.indexOf('];', cStart);
const cBlock = src.slice(cStart, cEnd);
const codes = [...cBlock.matchAll(/code: "([A-Z]{2})"/g)].map((m) => m[1]);
console.log('COUNTRIES entries:', codes.length);
const dupes = codes.filter((c, i) => codes.indexOf(c) !== i);
console.log('duplicates:', dupes.length ? dupes.join(', ') : 'none');
// NO_DATA collision check
const ndStart = src.indexOf('export const NO_DATA_COUNTRIES');
const ndBlock = src.slice(ndStart, src.indexOf(');', ndStart));
const nd = [...ndBlock.matchAll(/"([A-Z]{2})"/g)].map((m) => m[1]);
const collide = codes.filter((c) => nd.includes(c));
console.log('COUNTRIES ∩ NO_DATA:', collide.length ? collide.join(', ') : 'none');
