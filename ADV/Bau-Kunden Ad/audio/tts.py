# Edge neural TTS (no key). usage: python3 tts.py <voice> <outdir> [de|en]
import asyncio, json, os, sys, edge_tts
voice, d = sys.argv[1], sys.argv[2]; lang = sys.argv[3] if len(sys.argv) > 3 else 'de'; os.makedirs(d, exist_ok=True)
async def main():
    for l in json.load(open('script.json')):
        out = f"{d}/{l['id']}.mp3"
        for k in range(8):
            if os.path.exists(out) and os.path.getsize(out) > 1000: break
            try: await edge_tts.Communicate(l[lang], voice, rate='-3%', proxy=os.environ.get('HTTPS_PROXY')).save(out)
            except Exception as e: print('retry', l['id'], str(e)[:40]); await asyncio.sleep(3 + 3 * k)
asyncio.run(main())
