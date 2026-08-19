import fs from "fs";

// Read token from file (never echo it).
const TOKEN = fs
  .readFileSync("C:/Users/l'x/WorkBuddy/2026-07-15-01-50-53/.workbuddy/gh-token.txt", "utf8")
  .trim();

const REPO = "863683348/public-holidays";
const BRANCH = "master";
const BASE = `https://api.github.com/repos/${REPO}/contents`;

const files = [
  "src/lib/blog-posts.ts",
  "src/i18n/messages/ar.json",
  "src/i18n/messages/de.json",
  "src/i18n/messages/en.json",
  "src/i18n/messages/es.json",
  "src/i18n/messages/fr.json",
  "src/i18n/messages/it.json",
  "src/i18n/messages/ja.json",
  "src/i18n/messages/ko.json",
  "src/i18n/messages/nl.json",
  "src/i18n/messages/pt.json",
  "src/i18n/messages/ru.json",
  "src/i18n/messages/zh.json",
];

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  "Content-Type": "application/json",
  "User-Agent": "seo-day11-push",
  Accept: "application/vnd.github+json",
};

async function getSha(path) {
  const res = await fetch(`${BASE}/${path}?ref=${BRANCH}`, { headers });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GET ${path} -> ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.sha;
}

async function put(path, content) {
  const sha = await getSha(path);
  const body = JSON.stringify({
    message: `feat(blog): add Sweden public holidays post (en/zh) + i18n keys [day11]`,
    content: Buffer.from(content, "utf8").toString("base64"),
    branch: BRANCH,
    ...(sha ? { sha } : {}),
  });
  const res = await fetch(`${BASE}/${path}`, { method: "PUT", headers, body });
  if (!res.ok) throw new Error(`PUT ${path} -> ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.commit?.sha || "ok";
}

let ok = 0;
let fail = 0;
for (const f of files) {
  try {
    const content = fs.readFileSync(f, "utf8");
    const sha = await put(f, content);
    console.log(`OK   ${f}  (${sha})`);
    ok++;
  } catch (e) {
    console.error(`FAIL ${f}: ${e.message}`);
    fail++;
  }
  // tiny delay to avoid secondary-rate-limit
  await new Promise((r) => setTimeout(r, 300));
}
console.log(`\nPUSH DONE ok=${ok} fail=${fail}`);
process.exit(fail ? 1 : 0);
