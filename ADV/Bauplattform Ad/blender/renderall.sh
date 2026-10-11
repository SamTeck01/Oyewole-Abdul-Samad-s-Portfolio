#!/bin/bash
# renders every shot at half rate (15 fps) and encodes to remotion/public/3d with frame interpolation to 30 fps
cd "$(dirname "$0")"
P=../remotion/public/3d
enc() { # name w h
  ffmpeg -y -loglevel error -framerate 15 -pattern_type glob -i "renders/$1/f_*.png" -vf "minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:vsbmc=1,scale=$2:$3:flags=lanczos,format=yuv420p" -c:v libx264 -crf 16 -preset slow "$P/$1.mp4"
}
for s in rise bim explode site twin; do
  rm -f renders/$s/f_*; STEP=2 PCT=100 SAMPLES=24 blender -b -P build.py -- $s >/dev/null 2>&1; enc $s 1920 1080; echo done $s
done
for t in paper cone helmet crane calc truck cable brick; do
  rm -f renders/tile_$t/f_*; STEP=2 SAMPLES=16 blender -b -P build.py -- tile_$t >/dev/null 2>&1; enc tile_$t 960 704; echo done $t
done
