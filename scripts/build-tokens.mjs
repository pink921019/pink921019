#!/usr/bin/env node
// design-system/tokens.json → design-system/tokens.css
// 토큰 바꿨으면: node scripts/build-tokens.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const t = JSON.parse(readFileSync(join(root, 'design-system/tokens.json'), 'utf8'));
const [first, ...rest] = t.color.themes.map((x) => x.id);
const val = (tok, th) => (typeof tok.value === 'string' ? tok.value : tok.value[th] ?? tok.value[first]);
const colors = (th) => t.color.tokens.map((c) => `  --${c.name}: ${val(c, th)};`).join('\n');

const lines = [];
lines.push(`/* ${t.name} — design-system/tokens.json에서 생성됨. 직접 고치지 말고 node scripts/build-tokens.mjs */`);
lines.push(`@import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans+KR:wght@400;600;700&display=swap");`);
lines.push(`:root {\n${colors(first)}`);
for (const [k, v] of Object.entries(t.type.families)) lines.push(`  --font-${k}: ${v};`);
for (const fam of ['spacing', 'radius']) for (const s of t[fam].tokens) lines.push(`  --${s.name}: ${s.value};`);
lines.push('}');
for (const th of rest) {
  lines.push(`@media (prefers-color-scheme: ${th}) {\n  :root:not([data-theme="${first}"]) {\n${colors(th).replace(/^/gm, '  ')}\n    color-scheme: ${th};\n  }\n}`);
  lines.push(`:root[data-theme="${th}"] {\n${colors(th)}\n  color-scheme: ${th};\n}`);
}
for (const g of t.type.groups) {
  for (const s of g.styles) {
    const fam = s.family ?? g.family;
    lines.push(`.t-${s.name} { font-family: var(--font-${fam}); font-size: ${s.fontSize}; line-height: ${s.lineHeight}; font-weight: ${s.fontWeight};${s.letterSpacing ? ` letter-spacing: ${s.letterSpacing};` : ''} }`);
  }
}
writeFileSync(join(root, 'design-system/tokens.css'), lines.join('\n') + '\n');
console.log('▶ design-system/tokens.css 만들었어');
