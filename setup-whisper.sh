#!/bin/bash
# 맥에서 yt-dlp + ffmpeg + whisper-cpp + large-v3-turbo 모델 한 번에 설치
set -euo pipefail

MODEL_NAME="ggml-large-v3-turbo-q5_0.bin"
MODEL_URL="https://huggingface.co/ggerganov/whisper.cpp/resolve/main/${MODEL_NAME}"
MODEL_DIR="$HOME/.cache/whisper"

# 1. Homebrew (없을 때만 설치 — 여기서 맥 비밀번호 물어봄)
if ! command -v brew >/dev/null 2>&1; then
  echo "▶ Homebrew 설치 중 (맥 비밀번호 입력하라고 나오면 입력해)"
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  if [ -x /opt/homebrew/bin/brew ]; then
    eval "$(/opt/homebrew/bin/brew shellenv)"
    grep -q 'brew shellenv' "$HOME/.zprofile" 2>/dev/null || \
      echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> "$HOME/.zprofile"
  elif [ -x /usr/local/bin/brew ]; then
    eval "$(/usr/local/bin/brew shellenv)"
  fi
else
  echo "▶ Homebrew 이미 있음"
fi

# 2. 패키지
echo "▶ yt-dlp, ffmpeg, whisper-cpp 설치 중"
brew install yt-dlp ffmpeg whisper-cpp

# 3. 모델
mkdir -p "$MODEL_DIR"
if [ -s "$MODEL_DIR/$MODEL_NAME" ]; then
  echo "▶ 모델 이미 있음: $MODEL_DIR/$MODEL_NAME"
else
  echo "▶ 모델 받는 중 (~550MB)"
  curl -L --fail -C - -o "$MODEL_DIR/$MODEL_NAME" "$MODEL_URL"
fi

# 4. 버전 확인
echo
echo "===== 설치된 버전 ====="
brew --version | head -1
echo "yt-dlp: $(yt-dlp --version)"
ffmpeg -version | head -1
brew list --versions whisper-cpp
ls -lh "$MODEL_DIR/$MODEL_NAME"
echo
echo "설치 끝!"
