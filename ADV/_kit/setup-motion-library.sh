#!/usr/bin/env bash
# One-command Motion Studio setup for a fresh cloud session.
# Usage: bash "/mnt/project-files/Motion Library/setup.sh"
# Installs Blender 4.5 LTS (from the saved installer), audio/voice tools, and system libs.
set -e
LIB="/mnt/project-files/Motion Library"

echo "== system libs (Blender runtime, espeak for Kokoro)"
apt-get install -y -qq libxi6 libxkbcommon0 libxrender1 libxxf86vm1 libxfixes3 libgl1 libegl1 libsm6 espeak-ng >/dev/null 2>&1 \
  || (apt-get update -qq >/dev/null 2>&1 && apt-get install -y -qq libxi6 libxkbcommon0 libxrender1 libxxf86vm1 libxfixes3 libgl1 libegl1 libsm6 espeak-ng >/dev/null 2>&1)

echo "== Blender 4.5 LTS"
if ! command -v blender >/dev/null; then
  mkdir -p /opt/blender
  tar -xJf "$LIB/installers/blender-4.5.14-linux-x64.tar.xz" -C /opt/blender --strip-components=1
  ln -sf /opt/blender/blender /usr/local/bin/blender
fi
blender -b --version 2>/dev/null | head -1

echo "== Python audio + voice tools"
python3 -m pip install -q faster-whisper librosa soundfile kokoro-onnx 2>&1 | grep -v -i warning || true
mkdir -p /opt/kokoro && cp -n "$LIB/models/"kokoro-v1.0.onnx "$LIB/models/"voices-v1.0.bin /opt/kokoro/

echo "== done. Library: $LIB  (3d/, hdri/, fonts/, sfx/, scripts/)"
echo "   Remotion kit: cd ADV/_kit && npm ci"
[ -n "$ELEVENLABS_API_KEY" ] && echo "   ElevenLabs key: present" || echo "   ElevenLabs key: MISSING (add ELEVENLABS_API_KEY in Project settings > Cloud environment)"
