# Kartoffel-Orpheus (German, emotion-controlled) via llama.cpp + SNAC decoder.
# usage: python ko.py <model.gguf> <out_dir> "<Speaker> - <Emotion>: text" [more prompts...]
import sys, time, numpy as np, torch, soundfile as sf
from llama_cpp import Llama
from snac import SNAC
llm = Llama(model_path=sys.argv[1], n_ctx=4096, n_threads=4, verbose=False)
snac = SNAC.from_pretrained("hubertsiuzdak/snac_24khz").eval()
def speak(prompt, seed=0, temp=0.6):
    ids = [128259] + llm.tokenize(prompt.encode(), add_bos=True, special=False) + [128009, 128260]
    llm.reset(); llm.set_seed(seed) if hasattr(llm, 'set_seed') else None
    codes, started = [], False
    for n, tok in enumerate(llm.generate(ids, temp=temp, top_p=0.95, top_k=40, repeat_penalty=1.1)):
        if tok == 128257: started = True; continue
        if tok in (128258, 128009) or n > 2400: break
        if started and tok >= 128266: codes.append(tok - 128266)
    codes = codes[: len(codes) // 7 * 7]
    l1, l2, l3 = [], [], []
    for i in range(0, len(codes), 7):
        c = [codes[i + j] - j * 4096 for j in range(7)]
        if min(c) < 0 or max(c) > 4095: continue
        l1.append(c[0]); l2 += [c[1], c[4]]; l3 += [c[2], c[3], c[5], c[6]]
    with torch.inference_mode():
        a = snac.decode([torch.tensor([l1]), torch.tensor([l2]), torch.tensor([l3])])
    return a[0, 0].numpy()
if __name__ == '__main__':
    for k, p in enumerate(sys.argv[3:]):
        t0 = time.time(); x = speak(p); sf.write(f'{sys.argv[2]}/ko_{k}.wav', x, 24000)
        print('ok', k, round(len(x) / 24000, 1), 's audio in', round(time.time() - t0), 's |', p, flush=True)
