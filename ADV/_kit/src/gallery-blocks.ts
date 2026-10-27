// Separate entry for the blocks gallery: npx remotion still src/gallery-blocks.ts Blk-<Id> out.png --frame=N
import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {loadFonts} from './kit/fonts';
import {ENTRIES, makeGalleryComp} from './gallery/BlocksGallery';

loadFonts();

const comps = ENTRIES.map((e) => ({e, C: makeGalleryComp(e)}));

const GalleryRoot: React.FC = () =>
  React.createElement(
    React.Fragment,
    null,
    comps.map(({e, C}) =>
      React.createElement(Composition, {key: e.id, id: `Blk-${e.id}`, component: C, width: 1920, height: 1080, fps: 60, durationInFrames: e.dur ?? 240}),
    ),
  );

registerRoot(GalleryRoot);
