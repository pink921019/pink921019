#!/usr/bin/env node
// Setup Terminal 스타일 이미지 만들기 (PNG)
//
//   node scripts/image.mjs --title "맥에서 Whisper 돌리기" --sub "설치부터 자막까지 10분" --out out/cover.png
//   node scripts/image.mjs --type steps --title "설치 순서" --steps "Homebrew 이미 있음|yt-dlp, ffmpeg 설치 중|모델 받는 중 (~550MB)|설치 끝!" --size square
//   node scripts/image.mjs --type quote --title "다시 돌려도 안전해야 돼" --sub "멱등성 이야기" --size story --theme dark
//
// 옵션: --type cover|steps|quote  --size og|square|portrait|story  --theme light|dark  --label "작은 머리말"  --out 경로
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { cardHTML, SIZES } from './lib/card.mjs';

export async function renderCard(opts, out) {
  let chromium;
  try {
    ({ chromium } = createRequire(import.meta.url)('playwright'));
  } catch {
    console.error('✕ playwright가 없어. 먼저 이거 돌려: npm install && npx playwright install chromium');
    process.exit(1);
  }
  const [w, h] = SIZES[opts.size] ?? SIZES.og;
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
    await page.setContent(cardHTML(opts), { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    mkdirSync(dirname(out), { recursive: true });
    await page.locator('.card').screenshot({ path: out });
  } finally {
    await browser.close();
  }
  return out;
}

function parseArgs(argv) {
  const o = {};
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i].replace(/^--/, '');
    o[k] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
  }
  return o;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const a = parseArgs(process.argv.slice(2));
  if (!a.title) {
    console.error('✕ --title 은 꼭 넣어줘. 예: node scripts/image.mjs --title "제목" --sub "부제"');
    process.exit(1);
  }
  const opts = { type: a.type ?? 'cover', size: a.size ?? 'og', theme: a.theme ?? 'light', title: a.title, sub: a.sub, label: a.label,
    steps: typeof a.steps === 'string' ? a.steps.split('|').map((s) => s.trim()).filter(Boolean) : [] };
  const out = resolve(a.out ?? `out/${opts.type}-${opts.size}-${Date.now()}.png`);
  console.log(`▶ ${opts.type} 이미지 만드는 중 (${(SIZES[opts.size] ?? SIZES.og).join('×')})`);
  await renderCard(opts, out);
  console.log(`▶ 끝! ${out}`);
}
