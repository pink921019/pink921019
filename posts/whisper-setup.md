---
title: 맥에서 Whisper로 유튜브 자막 뽑기
subtitle: 스크립트 하나로 설치 끝
date: 2026-11-16
tags: whisper · 맥
---

유튜브 영상 받아서 자막까지 뽑으려면 `yt-dlp`, `ffmpeg`, `whisper-cpp`랑 모델 파일이 필요해. 하나씩 깔면 귀찮으니까 스크립트 하나로 묶었어.

## 한 번에 설치

```bash
bash setup-whisper.sh
```

돌리면 이렇게 나와:

```terminal setup-whisper.sh
▶ Homebrew 이미 있음
▶ yt-dlp, ffmpeg, whisper-cpp 설치 중
▶ 모델 받는 중 (~550MB)
! 맥 비밀번호 입력하라고 나오면 입력해
▶ 설치 끝!
```

## 알아둘 것

- 이미 깔린 건 건너뛰니까 몇 번 돌려도 괜찮아.
- 모델은 `~/.cache/whisper`에 저장돼.
- 모델 받다가 끊기면 다시 돌려. 이어서 받아.

| 도구 | 하는 일 |
| --- | --- |
| yt-dlp | 영상 받기 |
| ffmpeg | 오디오 뽑기 |
| whisper-cpp | 받아쓰기 |
