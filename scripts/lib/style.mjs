// tokens.css + components.css를 읽어서 한 덩어리 CSS로 돌려줘 (HTML에 인라인으로 넣으려고)
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const css = () =>
  ['tokens.css', 'components.css'].map((f) => readFileSync(join(ROOT, 'design-system', f), 'utf8')).join('\n');
export const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// 터미널 줄 하나 → 컴포넌트 HTML. "▶ ..."은 Step, "이미 있음/끝"은 완료, "!"로 시작하면 주의, "✕"는 에러
export function termLine(raw) {
  const line = raw.replace(/\s+$/, '');
  const m = line.match(/^(▶|!|✕|x)\s+(.*)$/);
  if (!m) return `<div class="st-out">${esc(line) || '&nbsp;'}</div>`;
  let [, mark, text] = m;
  let cls = 'st-step';
  if (mark === '!') cls += ' is-warn';
  else if (mark === '✕' || mark === 'x') cls += ' is-error';
  else if (/이미 있음|끝|완료|done/i.test(text)) cls += ' is-done';
  const meta = text.match(/^(.*?)(\s*\([^)]*\))$/);
  const body = meta ? `${esc(meta[1])} <span class="st-meta">${esc(meta[2].trim())}</span>` : esc(text);
  return `<div class="${cls}">${body}</div>`;
}
