import asyncio, json, os, sys, edge_tts
voice, d = sys.argv[1], sys.argv[2]; lang = sys.argv[3] if len(sys.argv) > 3 else 'de'; os.makedirs(d, exist_ok=True)
async def main():
    for l in json.load(open('script.json')):
        await edge_tts.Communicate(l[lang].replace('Bau-Kunden', 'Bow-Koonden') if lang == 'en' else l[lang], voice, rate='-3%', proxy=os.environ.get('HTTPS_PROXY')).save(f"{d}/{l['id']}.mp3")
asyncio.run(main())
