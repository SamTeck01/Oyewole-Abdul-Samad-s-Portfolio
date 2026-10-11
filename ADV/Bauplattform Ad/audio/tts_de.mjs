// German VO via Microsoft Edge neural TTS (no API key). usage: node tts_de.mjs
import {EdgeTTS} from '/tmp/claude-0/etts/node_modules/node-edge-tts/dist/edge-tts.js';
import fs from 'fs';
const lines = JSON.parse(fs.readFileSync('script.json'));
for (const l of lines) {
  const out = `vo_de/${l.id}.mp3`;
  if (fs.existsSync(out)) continue;
  for (let k = 0; k < 4; k++) {
    try { await new EdgeTTS({voice: 'de-DE-SeraphinaMultilingualNeural', lang: 'de-DE', rate: '-4%', timeout: 30000}).ttsPromise(l.de, out); break; }
    catch (e) { console.log('retry', l.id, e.message); }
  }
  console.log(l.id);
}
