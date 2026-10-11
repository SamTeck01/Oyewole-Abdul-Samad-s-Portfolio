#!/bin/bash
# renders every shot at every frame (30 fps, no interpolation: interpolated motion looked laggy) and encodes to remotion/public/3d
cd "$(dirname "$0")"
P=../remotion/public/3d
enc() { # name w h
  ffmpeg -y -loglevel error -framerate 30 -pattern_type glob -i "renders/$1/f_*.png" -vf "scale=$2:$3:flags=lanczos,format=yuv420p" -c:v libx264 -crf 16 -preset slow "$P/$1.mp4"
}
for s in rise bim explode site twin; do
  rm -f renders/$s/f_*; STEP=1 STRETCH=1.4 PCT=67 SAMPLES=16 blender -b -P build.py -- $s >/dev/null 2>&1; enc $s 1920 1080; echo done $s
done
for t in paper cone helmet crane calc truck cable brick; do
  rm -f renders/tile_$t/f_*; STEP=1 SAMPLES=16 blender -b -P build.py -- tile_$t >/dev/null 2>&1; enc tile_$t 960 704; echo done $t
done
