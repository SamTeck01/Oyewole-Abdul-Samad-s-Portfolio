#!/bin/bash
# ElevenLabs TTS: tts_eleven.sh <voice_id> <model> <out.mp3> <text> [stability] [style]
V=$1; M=$2; O=$3; T=$4; S=${5:-0.4}; ST=${6:-0.45}
if [ "$M" = eleven_v3 ]; then VS="{\"stability\":$S}"; else VS="{\"stability\":$S,\"similarity_boost\":0.8,\"style\":$ST,\"use_speaker_boost\":true}"; fi
python3 -c 'import json,sys;print(json.dumps({"text":sys.argv[1],"model_id":sys.argv[2],"voice_settings":json.loads(sys.argv[3])}))' "$T" "$M" "$VS" |
curl -sS -f -X POST "https://api.elevenlabs.io/v1/text-to-speech/$V?output_format=mp3_44100_128" \
  -H "xi-api-key: $ELEVENLABS_API_KEY" -H "Content-Type: application/json" --data-binary @- -o "$O" || { echo "FAIL $O"; exit 1; }
