#!/bin/bash
# remaining shots in two parallel chains, every frame, slowed 1.4x
cd "$(dirname "$0")"
P=../remotion/public/3d
enc() { ffmpeg -y -loglevel error -framerate 30 -pattern_type glob -i "renders/$1/f_*.png" -vf "scale=$2:$3:flags=lanczos,format=yuv420p" -c:v libx264 -crf 16 -preset slow "$P/$1.mp4"; }
shot() { rm -f renders/$1/f_*; STEP=1 STRETCH=1.4 PCT=60 SAMPLES=12 blender -b -P build.py -- $1 >/dev/null 2>&1; enc $1 1920 1080; echo done $1; }
tile() { rm -f renders/tile_$1/f_*; STEP=1 SAMPLES=12 blender -b -P build.py -- tile_$1 >/dev/null 2>&1; enc tile_$1 960 704; echo done $1; }
( shot site; shot bim; shot twin ) &
( shot rise; shot explode ) &
wait
