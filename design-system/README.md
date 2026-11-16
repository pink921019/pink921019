# Setup Terminal

`setup-whisper.sh`의 말투랑 출력 형식에서 뽑은 디자인 시스템. 블로그 글, 썸네일, 인스타 이미지에 그대로 써.

## 파일

| 파일 | 내용 |
| --- | --- |
| `tokens.json` | 원본 값 (색, 글꼴, 간격, 모서리). 바꿀 땐 여기만 고쳐 |
| `tokens.css` | `tokens.json`에서 생성. `npm run tokens` |
| `components.css` | 컴포넌트 클래스 (`st-` 로 시작) |

## 처음 한 번 (맥)

```bash
npm install
npx playwright install chromium
```

## 블로그 글

`posts/`에 마크다운 쓰고:

```bash
npm run post -- posts/whisper-setup.md
```

`out/whisper-setup/index.html`(글)이랑 `cover.png`(대표 이미지 1200×630)가 나와. HTML은 브라우저로 열어서 복사해 붙이거나, 티스토리처럼 HTML 모드 있는 데는 그대로 붙여.
```` ```terminal 파일명 ```` 블록 안에 `▶`, `!`, `✕`로 시작하는 줄 쓰면 터미널 출력 블록으로 바뀌어.

## 이미지

```bash
npm run image -- --title "맥에서 Whisper 돌리기" --sub "설치부터 자막까지" --size og
```

```bash
npm run image -- --type steps --title "설치 순서" --steps "Homebrew 이미 있음|모델 받는 중 (~550MB)|설치 끝!" --size square
```

```bash
npm run image -- --type quote --title "다시 돌려도 안전해야 돼" --size story --theme dark
```

- `--type`: `cover`(제목), `steps`(▶ 단계), `quote`(한 문장)
- `--size`: `og` 1200×630, `square` 1080×1080, `portrait` 1080×1350, `story` 1080×1920
- `--theme`: `light`, `dark` · `--label`: 제목 위 작은 머리말 · `--out`: 저장 경로
- PNG는 2배 해상도로 나와.

## 컴포넌트

| 클래스 | 쓰임 |
| --- | --- |
| `st-step` (+ `is-active`, `is-done`, `is-warn`, `is-error`) | ▶ 진행 줄. 괄호 안 메타는 `<span class="st-meta">` |
| `st-badge` (+ `is-ok`, `is-warn`, `is-error`, `is-pink`) | 상태 배지 |
| `st-term` > `st-term-head` + `st-term-body` | 터미널 출력 블록. 일반 출력 줄은 `st-out` |
| `st-section` | `===== 제목 =====` 섹션 제목 |
| `st-done` | 결과 한마디. 강조는 `<em>` |
| `st-btn` (+ `is-quiet`) | 버튼 |
| `st-code` | 인라인 코드 |
| `st-post` | 블로그 본문 전체를 감싸는 클래스 |

## 말투 규칙

반말, 짧게. 진행은 `▶`, 이미 된 건 "이미 있음", 오래 걸리는 건 `(~550MB)`처럼 크기를 괄호로, 사용자가 손댈 건 미리 말하고, 마지막은 "끝!" 한마디.
