#!/usr/bin/env node
/**
 * 方案 B 博客发布范式：把新帖写入【外部 data repo】(public-holidays-blog-data) 的
 * blog-posts.json，push 该 repo，再调主站 /api/revalidate 即时刷新。
 * 主站因博客更新不再 redeploy → 2,208 个预渲染页 CDN 缓存永远温暖 → FOT 不飙升。
 *
 * 前置（本机/CI 环境变量）：
 *   BLOG_DATA_LOCAL  本地 data repo 克隆路径（默认 ../public-holidays-blog-data）
 *   GH_TOKEN         GitHub token（git push 用；出口受限时本机重试）
 *   REVALIDATE_SECRET 主站 Vercel 环境变量（revalidate 用；不设则靠 ISR 60s 自动生效）
 *   NEXT_PUBLIC_SITE_URL  主站地址（默认 https://public-holidays.shop）
 *
 * 用法 A（文件）：node scripts/sync-blog-data.mjs --file SEO2026/dayN/ph-blog-dayN.json
 *   文件 = BlogPost 对象数组（含 en/zh 双条）
 * 用法 B（stdin）：cat newposts.json | node scripts/sync-blog-data.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const DATA_LOCAL =
  process.env.BLOG_DATA_LOCAL ||
  path.resolve(process.cwd(), "..", "public-holidays-blog-data");
const JSON_PATH = path.join(DATA_LOCAL, "blog-posts.json");
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://public-holidays.shop";
const SECRET = process.env.REVALIDATE_SECRET;

// 1) 读入新帖
let newPosts = [];
try {
  if (process.argv.includes("--file")) {
    const f = process.argv[process.argv.indexOf("--file") + 1];
    newPosts = JSON.parse(fs.readFileSync(f, "utf8"));
  } else {
    const stdin = fs.readFileSync(0, "utf8");
    newPosts = JSON.parse(stdin);
  }
} catch (e) {
  console.error("读取新帖失败：", e.message);
  process.exit(1);
}
if (!Array.isArray(newPosts) || newPosts.length === 0) {
  console.error("无新帖，退出");
  process.exit(1);
}

// 2) 合并到 data JSON（按 slug+locale 去重）
let existing = [];
try {
  existing = JSON.parse(fs.readFileSync(JSON_PATH, "utf8"));
} catch {
  existing = [];
}
const seen = new Set(existing.map((p) => (p.locale || "en") + ":" + p.slug));
let added = 0;
for (const p of newPosts) {
  const k = (p.locale || "en") + ":" + p.slug;
  if (seen.has(k)) continue;
  existing.push(p);
  seen.add(k);
  added++;
}
existing.sort(
  (a, b) =>
    new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime(),
);
fs.writeFileSync(JSON_PATH, JSON.stringify(existing, null, 2) + "\n");
console.log(`合并 ${added} 篇新帖，总计 ${existing.length}`);

// 3) push data repo（独立 deployment，主站缓存不受影响）
try {
  execFileSync("git", ["-C", DATA_LOCAL, "add", "blog-posts.json"], {
    stdio: "inherit",
  });
  execFileSync(
    "git",
    ["-C", DATA_LOCAL, "commit", "-m", `blog: add ${added} posts (${new Date().toISOString().slice(0, 10)})`],
    { stdio: "inherit" },
  );
  execFileSync("git", ["-C", DATA_LOCAL, "push", "origin", "main"], {
    stdio: "inherit",
  });
  console.log("✅ data repo pushed");
} catch (e) {
  console.error("⚠️ git push 失败（出口受限？本机重试）：", e.message);
}

// 4) revalidate 主站（清 fetch cache + CDN 缓存，新帖秒级生效）
if (SECRET) {
  const localePaths = [
    ...new Set(newPosts.map((p) => "/" + (p.locale || "en") + "/blog")),
  ];
  try {
    const r = await fetch(SITE + "/api/revalidate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        secret: SECRET,
        tags: ["blog-posts"],
        paths: localePaths,
      }),
    });
    const txt = await r.text();
    console.log("✅ revalidate ->", r.status, txt);
  } catch (e) {
    console.error("⚠️ revalidate 失败（ISR 60s 内也会自动生效）：", e.message);
  }
} else {
  console.log("ℹ️ 未设 REVALIDATE_SECRET，跳过 revalidate（ISR 60s 内自动生效）");
}
