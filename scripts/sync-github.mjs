import fs from 'node:fs';
import path from 'node:path';

const TOKEN = process.env.GH_TOKEN;
const OWNER = '863683348';
const REPO = 'public-holidays';
const BASE = "C:\\Users\\l'x\\WorkBuddy\\2026-08-04-13-14-21\\public-holidays-repo";

const api = (method, p, body) =>
  fetch(`https://api.github.com${p}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'workbuddy-push',
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: body ? JSON.stringify(body) : undefined,
  }).then(async (r) => {
    const text = await r.text();
    if (!r.ok) throw new Error(`GitHub API ${method} ${p} -> ${r.status}: ${text.slice(0, 400)}`);
    return text ? JSON.parse(text) : {};
  });

const SKIP_DIRS = new Set(['node_modules', '.next', '.git', '.vercel', 'out']);

function walk(dir, rel, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    const r = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      if (r === 'public/cmap' || r === 'public/standard_fonts') continue;
      walk(full, r, out);
    } else {
      if (e.name.startsWith('.env') && e.name.endsWith('.local')) continue;
      if (e.name === 'pdf.worker.min.mjs') continue;
      if (e.name === 'demo-uploaded.png' || e.name === 'probe.html') continue;
      if (e.name === '.DS_Store' || e.name === 'Thumbs.db') continue;
      if (e.name.endsWith('.tsbuildinfo')) continue;
      if (r.startsWith('public/cmap/') || r.startsWith('public/standard_fonts/')) continue;
      out.push(r);
    }
  }
  return out;
}

const files = walk(BASE, '');
console.log(`[1] 待同步文件数: ${files.length}`);

const ref = await api('GET', `/repos/${OWNER}/${REPO}/git/refs/heads/master`);
const parentSha = ref.object.sha;
console.log(`[2] 当前 main: ${parentSha}`);

// 并发建 blob，限流 8
const entries = [];
const CONC = 8;
for (let i = 0; i < files.length; i += CONC) {
  const batch = files.slice(i, i + CONC);
  const res = await Promise.all(
    batch.map(async (f) => {
      const buf = fs.readFileSync(path.join(BASE, f));
      const content = buf.toString('base64');
      const r = await api('POST', `/repos/${OWNER}/${REPO}/git/blobs`, {
        content,
        encoding: 'base64',
      });
      return { path: f, mode: '100644', type: 'blob', sha: r.sha };
    })
  );
  entries.push(...res);
  console.log(`    blob ${Math.min(i + CONC, files.length)}/${files.length}`);
}

const tree = await api('POST', `/repos/${OWNER}/${REPO}/git/trees`, { tree: entries });
console.log(`[3] tree 创建完成: ${tree.sha} (${entries.length} 项)`);

const commit = await api('POST', `/repos/${OWNER}/${REPO}/git/commits`, {
  message:
    'feat: add blog day 1 - us federal holidays 2026-2027\n\n' +
    '- New bilingual blog post (EN/ZH) with full federal holiday lists for 2026 & 2027\n' +
    '- In-lieu weekend rules + best long weekends table\n' +
    '- FAQPage schema (6 questions per locale) for PAA capture\n' +
    '- Content-driven: blog list + sitemap auto-update from BLOG_POSTS',
  tree: tree.sha,
  parents: [parentSha],
});
console.log(`[4] commit: ${commit.sha}`);

await api('PATCH', `/repos/${OWNER}/${REPO}/git/refs/heads/master`, {
  sha: commit.sha,
  force: false,
});
console.log(`[5] main 已更新 -> ${commit.sha}`);
console.log('DONE');
