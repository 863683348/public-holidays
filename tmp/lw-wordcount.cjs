const fs = require("fs");
const src = fs.readFileSync("src/lib/blog-posts.ts", "utf8");

function extract(id) {
  // Find the record block containing "id: <id>," then capture its content backtick.
  const idx = src.indexOf(`id: ${id},`);
  if (idx === -1) return null;
  const contentIdx = src.indexOf("content: `", idx);
  if (contentIdx === -1) return null;
  const start = contentIdx + "content: `".length;
  const end = src.indexOf("`", start);
  if (end === -1) return null;
  return src.slice(start, end);
}

for (const id of [117, 118, 119, 120, 121, 122, 123, 124]) {
  const c = extract(id);
  if (!c) {
    console.log(id, "NOT FOUND");
    continue;
  }
  const text = c
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = text.split(" ").filter(Boolean).length;
  const zhChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  console.log(id, "total tokens:", words, "| zh chars:", zhChars);
}
