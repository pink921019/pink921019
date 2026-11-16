#!/usr/bin/env node
// 마크다운 글 → Setup Terminal 스타일 블로그 HTML + 대표 이미지
//
//   node scripts/post.mjs posts/whisper-setup.md
//   node scripts/post.mjs posts/whisper-setup.md --no-image   (이미지 건너뛰기)
//
// 결과: out/<글이름>/index.html (CSS 다 들어간 한 파일), out/<글이름>/cover.png (1200×630)
// 글 맨 위 frontmatter: title, subtitle, date, tags
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { css, esc, ROOT } from './lib/style.mjs';
import { frontmatter, markdown } from './lib/markdown.mjs';

const file = process.argv[2];
if (!file) {
  console.error('✕ 글 파일 경로 넣어줘. 예: node scripts/post.mjs posts/example.md');
  process.exit(1);
}
const slug = basename(file).replace(/\.mdx?$/, '');
const { meta, body } = frontmatter(readFileSync(file, 'utf8'));
const title = meta.title ?? body.match(/^#\s+(.*)$/m)?.[1] ?? slug;
const content = markdown(body.replace(/^#\s+.*\n/, ''));
const outDir = resolve(ROOT, 'out', slug);
mkdirSync(outDir, { recursive: true });
const noImage = process.argv.includes('--no-image');

const html = `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
${meta.subtitle ? `<meta name="description" content="${esc(meta.subtitle)}">` : ''}
${noImage ? '' : '<meta property="og:image" content="cover.png">'}
<style>${css()}
body{margin:0;background:var(--ground);color:var(--ink);padding:var(--space-8) max(16px,env(safe-area-inset-left,0px))}
.head{display:grid;gap:var(--space-2);margin-bottom:var(--space-8)}
</style></head>
<body><article class="st-post">
<header class="head">
  ${noImage ? '' : '<img src="cover.png" alt="" width="1200" height="630">'}
  <p class="st-post-meta">${esc([meta.date, meta.tags].filter(Boolean).join(' · '))}</p>
  <h1>${esc(title)}</h1>
  ${meta.subtitle ? `<p class="st-post-meta" style="font-size:14px;line-height:20px">▶ ${esc(meta.subtitle)}</p>` : ''}
</header>
${content}
</article></body></html>
`;
writeFileSync(join(outDir, 'index.html'), html);
console.log(`▶ 글 만들었어: ${join(outDir, 'index.html')}`);

if (!noImage) {
  const { renderCard } = await import('./image.mjs');
  console.log('▶ 대표 이미지 만드는 중 (1200×630)');
  await renderCard({ type: 'cover', size: 'og', title, sub: meta.subtitle, label: meta.tags }, join(outDir, 'cover.png'));
  console.log(`▶ 끝! ${join(outDir, 'cover.png')}`);
}
