#!/bin/bash
# Clone a voice from a video/audio file with ElevenLabs Instant Voice Cloning.
# Usage: ./clone.sh <video-or-audio> <voice-name>
# Writes work/<name>_clean.wav (what gets uploaded) and work/<name>.voice_id
set -e
cd "$(dirname "$0")"
IN=$1; NAME=$2
# Extract the voice: mono 44.1k, cut rumble/hiss, gentle de-noise, even loudness.
ffmpeg -v error -y -i "$IN" -vn -ac 1 -ar 44100 \
  -af "highpass=f=70,lowpass=f=14000,afftdn=nf=-25,loudnorm=I=-18:TP=-2" "work/${NAME}_clean.wav"
# Drop long silences so the sample is mostly speech.
ffmpeg -v error -y -i "work/${NAME}_clean.wav" \
  -af "silenceremove=stop_periods=-1:stop_duration=0.6:stop_threshold=-45dB" "work/${NAME}_speech.wav"
echo "speech length: $(ffprobe -v error -show_entries format=duration -of csv=p=0 "work/${NAME}_speech.wav") s"
curl -sS -f -X POST https://api.elevenlabs.io/v1/voices/add -H "xi-api-key: $ELEVENLABS_API_KEY" \
  -F "name=$NAME" -F "remove_background_noise=true" -F "files=@work/${NAME}_speech.wav" \
  | python3 -c "import sys,json;print(json.load(sys.stdin)['voice_id'])" > "work/${NAME}.voice_id"
echo "voice_id: $(cat "work/${NAME}.voice_id")"
