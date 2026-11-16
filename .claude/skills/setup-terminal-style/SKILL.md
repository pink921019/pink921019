---
name: setup-terminal-style
description: 블로그 글, 썸네일, 인스타 이미지, 카드뉴스, 웹페이지, 아티팩트 등 눈에 보이는 걸 만들 때 Setup Terminal 디자인 시스템(핑크 ▶, 반말, 터미널 말투)을 적용해. 사용자가 "블로그 글 써줘", "이미지 만들어줘", "썸네일", "카드", "포스팅", "내 스타일로"라고 하면 써.
---

# Setup Terminal 스타일로 만들기

이 레포의 디자인 시스템: 값은 `design-system/tokens.json`, CSS는 `design-system/tokens.css` + `design-system/components.css`.
규칙(말투·색·글꼴)은 `design-system/README.md`. 만들기 전에 그거 먼저 읽어.

## 블로그 글

1. `posts/<영문-슬러그>.md`에 글 써. 맨 위 frontmatter:
   ```
   ---
   title: 제목
   subtitle: 한 줄 요약
   date: YYYY-MM-DD
   tags: 태그 · 태그
   ---
   ```
2. 말투는 사용자 말투 그대로: 반말, 짧은 문장, 사과·과장 없음.
3. 명령어 실행 결과는 ```` ```terminal 파일명 ```` 블록으로. 줄 머리: `▶`(진행), `!`(사용자가 손댈 것), `✕`(실패). "이미 있음", "끝"이 들어간 ▶ 줄은 자동으로 완료색.
4. `node scripts/post.mjs posts/<슬러그>.md` → `out/<슬러그>/index.html` + `cover.png`.
5. 결과 HTML 스크린샷 한 번 보고, 사용자한테 경로 알려줘.

## 이미지

```
node scripts/image.mjs --type cover|steps|quote --size og|square|portrait|story --theme light|dark \
  --title "제목" --sub "부제" --label "머리말" --steps "줄1|줄2|줄3" --out out/이름.png
```

- 블로그 대표 이미지·링크 미리보기 → `cover` + `og`
- 인스타 피드 → `square` 또는 `portrait`, 스토리·릴스 → `story`
- 순서·과정 설명 → `steps`, 한 문장 강조 → `quote`
- 카드뉴스 여러 장이면 같은 `--theme`·`--size`로 여러 번 돌려서 `out/<주제>-01.png`, `-02.png`… 로 저장.
- 만든 PNG는 Read로 한 번 보고 글자 잘림 없는지 확인.

## 그 밖에 화면 만들 때 (아티팩트, 웹페이지)

- `tokens.css`·`components.css` 내용을 `<style>`에 넣고 `st-` 클래스(`st-step`, `st-badge`, `st-term`, `st-section`, `st-done`, `st-btn`, `st-post`) 써.
- 색은 토큰 이름으로만(`var(--pink)` 등). 대표색은 `pink` 하나, 상태는 `ok`/`warn`/`error`.
- 글꼴: 설명 `var(--font-sans)`, 명령어·숫자 `var(--font-mono)`.
