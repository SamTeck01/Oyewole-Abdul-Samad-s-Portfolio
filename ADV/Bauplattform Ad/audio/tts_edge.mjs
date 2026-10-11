// Voiceover via Microsoft Edge neural TTS (free, no API key). usage: node tts_edge.mjs en|de
import {EdgeTTS} from '/tmp/claude-0/etts/node_modules/node-edge-tts/dist/edge-tts.js';
import fs from 'fs';
const lang = process.argv[2] ?? 'en';
const V = {en: {voice: 'en-US-AvaMultilingualNeural', lang: 'en-US', rate: '-4%'}, de: {voice: 'de-DE-SeraphinaMultilingualNeural', lang: 'de-DE', rate: '-4%'}}[lang];
const dir = lang === 'en' ? 'vo_en' : 'vo_de';
fs.mkdirSync(dir, {recursive: true});
const say = (t) => (lang === 'en' ? t.replace(/Baucheck24/g, 'Bowcheck 24').replace('DATEV', 'Dahtef') : t);
for (const l of JSON.parse(fs.readFileSync('script.json'))) {
  const out = `${dir}/${l.id}.mp3`;
  if (fs.existsSync(out)) continue;
  for (let k = 0; k < 4; k++) {
    try { await new EdgeTTS({...V, timeout: 30000}).ttsPromise(say(l[lang]), out); break; } catch (e) { console.log('retry', l.id, e.message); }
  }
  console.log(l.id);
}
