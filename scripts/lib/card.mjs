// 이미지 카드 HTML. 종류: cover(제목 카드), steps(▶ 단계 카드), quote(한 문장 카드)
import { css, esc, termLine } from './style.mjs';

export const SIZES = {
  og: [1200, 630],      // 블로그 대표 이미지, 링크 미리보기
  square: [1080, 1080], // 인스타 피드
  portrait: [1080, 1350], // 인스타 세로
  story: [1080, 1920],  // 스토리, 릴스 커버
};

// 오른쪽(또는 위쪽) 장식: 핑크 슬랩 + ▶ 패턴 + 블록 몇 개. 표지랑 같은 문법.
function blocks(w, h, vertical) {
  const u = 32; // space-8
  const tri = (x, y, s) => `<polygon class="cut" points="${x},${y} ${x + s},${y + s / 2} ${x},${y + s}"/>`;
  if (vertical) {
    const bh = Math.round(h * 0.46 / u) * u;
    const sw = Math.round(w * 0.42 / u) * u, sx = w - sw - u * 4;
    let t = '';
    for (let r = 0; r < Math.floor((bh - u * 2) / u); r++) for (let c = 0; c < Math.floor((sw - u) / (u * 1.5)); c++) t += tri(sx + u + c * u * 1.5, u + r * u, 16);
    return `<svg width="${w}" height="${bh}" viewBox="0 0 ${w} ${bh}" class="deco top">
      <rect class="soft" x="${sx - u * 5}" y="${bh - u * 3}" width="${u * 5}" height="${u * 3}" rx="2"/>
      <rect class="pink" x="${sx}" y="0" width="${sw}" height="${bh}"/>${t}
      <rect class="ink" x="${w - u * 4}" y="0" width="${u * 4}" height="${u * 4}" rx="2"/>
      <rect class="ok" x="${w - u * 4}" y="${u * 5}" width="${u * 4}" height="${bh - u * 5}" rx="2"/></svg>`;
  }
  const x0 = Math.round(w * 0.6 / u) * u, sw = u * 6, sx = x0 + u * 4;
  let t = '';
  for (let r = 0; r < Math.floor((h - u * 3) / u); r++) for (let c = 0; c < 3; c++) t += tri(sx + u * 1.5 + c * u * 1.5, u * 1.5 + r * u, 16);
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" class="deco side">
    <rect class="soft" x="${x0}" y="${h - u * 3}" width="${u * 4}" height="${u * 3}" rx="2"/>
    <rect class="pink" x="${sx}" y="0" width="${sw}" height="${h}"/>${t}
    <rect class="ink" x="${sx + sw}" y="0" width="${w - sx - sw}" height="${Math.round(h * 0.42)}" rx="2"/>
    <rect class="ok" x="${sx + sw}" y="${Math.round(h * 0.42) + u}" width="${w - sx - sw}" height="${h - Math.round(h * 0.42) - u}" rx="2"/></svg>`;
}

export function cardHTML({ type = 'cover', size = 'og', theme = 'light', title = '', sub = '', steps = [], label = '' }) {
  const [w, h] = SIZES[size] ?? SIZES.og;
  const vertical = h > w * 0.8;
  const scale = w / 1200;
  let inner;
  if (type === 'steps') {
    inner = `<div class="txt">
      ${label ? `<p class="label">${esc(label)}</p>` : ''}
      <h1 class="title small">${esc(title)}</h1>
      <div class="st-term"><div class="st-term-head"><span>${esc(sub || 'setup.sh')}</span><span>zsh</span></div>
      <div class="st-term-body">${steps.map((s) => termLine(/^(▶|!|✕|x)\s/.test(s) ? s : '▶ ' + s)).join('')}</div></div></div>`;
  } else if (type === 'quote') {
    inner = `<div class="txt">${label ? `<p class="label">${esc(label)}</p>` : ''}
      <p class="qtext">${esc(title)}</p>${sub ? `<p class="sub">▶ ${esc(sub)}</p>` : ''}</div>`;
  } else {
    inner = `${blocks(w, h, vertical)}<div class="txt">${label ? `<p class="label">${esc(label)}</p>` : ''}
      <h1 class="title">${esc(title)}</h1>${sub ? `<p class="sub">▶ ${esc(sub)}</p>` : ''}</div>`;
  }
  return `<!doctype html><html data-theme="${theme}"><head><meta charset="utf-8"><style>${css()}
  html,body{margin:0}
  .card{position:relative;width:${w}px;height:${h}px;overflow:hidden;background:var(--ground);color:var(--ink);font-family:var(--font-sans)}
  .pink{fill:var(--pink)} .ink{fill:var(--ink)} .ok{fill:var(--ok)} .soft{fill:var(--pink-soft)} .cut{fill:var(--ground)}
  .deco{position:absolute} .deco.side{inset:0} .deco.top{top:0;left:0}
  .txt{position:absolute;left:${64 * scale}px;right:${64 * scale}px;bottom:${64 * scale}px;display:grid;gap:${16 * scale}px}
  .card.cover:not(.vertical) .txt{right:auto;max-width:${Math.round(w * 0.6 - 112 * scale)}px}
  .card.steps .txt,.card.quote .txt{top:${64 * scale}px;align-content:center}
  .title{margin:0;font-weight:700;font-size:${(vertical ? 96 : 72) * scale}px;line-height:1.08;letter-spacing:-0.02em;text-wrap:balance;word-break:keep-all}
  .title.small{font-size:${(vertical ? 64 : 44) * scale}px}
  .qtext{margin:0;font-weight:700;font-size:${(vertical ? 96 : 56) * scale}px;line-height:1.25;letter-spacing:-0.015em;text-wrap:balance;word-break:keep-all}
  .qtext::before{content:"▶";display:block;color:var(--pink);font-size:.6em;margin-bottom:${16 * scale}px}
  .sub{margin:0;font-family:var(--font-mono);font-size:${22 * scale}px;line-height:1.4;color:var(--muted)}
  .label{margin:0;font-family:var(--font-mono);font-size:${18 * scale}px;letter-spacing:.04em;color:var(--pink)}
  .card .st-term{zoom:${(vertical ? 1.9 : 1.5) * scale}}
  </style></head><body><div class="card ${type}${vertical ? ' vertical' : ''}">${inner}</div></body></html>`;
}
