const fs = require('fs');
const path = require('path');
const dir = 'src/i18n/messages';
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
let ok = true;
// 1. JSON parse all
for (const f of files) {
  try { JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); }
  catch (e) { ok = false; console.log('PARSE_FAIL ' + f + ': ' + e.message); }
}
// 2. Required namespaces per SPEC-002 §5 / §7.6 + Tier-1
const reqNs = ['compare', 'linkToUs', 'homeAbout', 'country', 'holidayDetail', 'blog', 'pricing'];
// 3. Required keys
const reqKeys = {
  compare: ['metaTitle','metaDescription','heading','subtitle','pickCountries','maxCountries','minCountries','legendAll','legendSome','legendNone','allOffHeading','allOffNone','nearMissPrefix','sharedCount','longWeekendCount','share','copied','yearLabel'],
  linkToUs: ['metaTitle','metaDescription','heroHeading','heroBody','whyHeading','cardCountries','cardLanguages','cardFree','badgeHeading','textLinkHeading','footerLinkHeading','attributionHeading','idealHeading','travel','travelBody','hr','hrBody','dir','dirBody','edu','eduBody','popularHeading','guidelinesHeading','preview'],
  homeAbout: ['heading','p1','p2','li1','li2','li3','li4','forTeamsLink','forTeamsLinkLabel'],
  country: ['faqWhenNext','faqWhenNextAnswer'],
  holidayDetail: ['adjacentHeading','prevYearLink','nextYearLink','faqNextOccurrence','faqNextOccurrenceAnswer','faqNextOccurrenceNone','regionsHeading','datesWeekdayHeading'],
  blog: ['shareTwitter','shareLinkedIn','shareFacebook','byAuthor','categoryLabel'],
};
const issues = {};
for (const f of files) {
  const j = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  const missingNs = reqNs.filter((n) => !(n in j));
  if (missingNs.length) { issues[f] = issues[f] || []; issues[f].push('missing-ns: ' + missingNs.join(',')); }
  for (const [ns, keys] of Object.entries(reqKeys)) {
    if (!j[ns]) continue;
    const missing = keys.filter((k) => !(k in j[ns]));
    if (missing.length) { issues[f] = issues[f] || []; issues[f].push(ns + ' missing-keys: ' + missing.join(',')); }
  }
}
if (Object.keys(issues).length === 0) {
  console.log('MESSAGES_OK: ' + files.length + ' files parse; all required namespaces+keys present');
} else {
  ok = false;
  for (const [f, arr] of Object.entries(issues)) console.log(f + ': ' + arr.join(' | '));
}
console.log('TOTAL=' + files.length);
