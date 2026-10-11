#!/bin/bash
# usage: stills.sh COMP outdir  -> renders a still at the end of each VO line + montage
COMP=$1; OUT=$2; mkdir -p $OUT
TIMES=$(python3 -c "
import json;c=json.load(open('src/cues_de.json' if '$COMP'=='Film-DE' else 'src/cues.json'))
ts=[l['end']-0.1 for l in c['lines']]+[c['lines'][4]['end']+1.0, c['lines'][4]['end']+2.2, c['lines'][4]['end']+3.4, c['lines'][4]['end']+4.6, c['total']+1.5]
print(' '.join(str(int(t*60)) for t in sorted(ts)))")
for f in $TIMES; do echo "--frame=$f"; done > /dev/null
npx remotion still src/index.ts $COMP $OUT/f.png --frame=0 --log=error >/dev/null 2>&1
i=0; for f in $TIMES; do i=$((i+1)); npx remotion still src/index.ts $COMP $OUT/s_$(printf %02d $i).png --frame=$f --log=error 2>&1 | grep -i error; done
ffmpeg -v error -y -pattern_type glob -i "$OUT/s_*.png" -vf "scale=480:-1,tile=5x7" -frames:v 1 $OUT/sheet.jpg
