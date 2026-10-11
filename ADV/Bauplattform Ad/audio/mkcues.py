import json,sys
c=json.load(open('audio/cues_en.json'))
out=[]
for L in c['lines']:
    ws=[dict(w) for w in c['words'] if w['s']>=L['start']-0.45 and w['s']<L['end']-0.05]
    m=[]
    for w in ws:
        if m and w['w'].startswith('24') and m[-1]['w'].lower().startswith('b'): m[-1]['e']=w['e']; continue
        m.append(w)
    ws=m
    toks=L['en'].split()
    if len(ws)==len(toks):
        words=[{'t':t,'s':w['s'],'e':w['e']} for t,w in zip(toks,ws)]
    else:
        tot=sum(len(t)+1 for t in toks); acc=0; dur=L['end']-L['start']; words=[]
        for t in toks:
            s=L['start']+dur*acc/tot; acc+=len(t)+1; words.append({'t':t,'s':round(s,3),'e':round(L['start']+dur*acc/tot,3)})
        print('fallback',L['id'],len(ws),len(toks))
    # de words: spread over same line window (DE version uses the same picture timing)
    dt=L['de'].split(); tot=sum(len(t)+1 for t in dt); acc=0; dur=L['end']-L['start']; dw=[]
    for t in dt:
        s=L['start']+dur*0.95*acc/tot; acc+=len(t)+1; dw.append({'t':t,'s':round(s,3)})
    out.append({**L,'words':words,'dewords':dw})
json.dump({'total':c['total'],'lines':out},open('remotion/src/cues.json','w'),indent=1)
print('ok',c['total'])
