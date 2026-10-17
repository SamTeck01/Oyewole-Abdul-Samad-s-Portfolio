# Edge neural TTS (works again from the cloud as of 17 Oct). usage: python tts_edge.py <voice> <outdir> de|en
import asyncio, json, os, subprocess, sys, edge_tts
voice, d, lang = sys.argv[1], sys.argv[2], sys.argv[3]; os.makedirs(d, exist_ok=True)
async def main():
    for l in json.load(open('script.json')):
        mp3 = f"{d}/{l['id']}.mp3"
        await edge_tts.Communicate(l.get(lang + '_say', l[lang]), voice, rate='+4%', proxy=os.environ.get('HTTPS_PROXY')).save(mp3)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', mp3, '-ar', '24000', f"{d}/{l['id']}.wav"]); os.remove(mp3); print(l['id'])
asyncio.run(main())
