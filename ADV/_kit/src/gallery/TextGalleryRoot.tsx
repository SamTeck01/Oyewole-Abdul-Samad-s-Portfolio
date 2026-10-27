import React from 'react';
import {Composition} from 'remotion';
import {PANELS, TextGallery} from './TextGallery';

export const TextGalleryRoot: React.FC = () => (
  <>
    {PANELS.map((p) => (
      <Composition key={p.id} id={p.id} component={TextGallery} width={1920} height={1080} fps={60} durationInFrames={p.dur} defaultProps={{id: p.id}} />
    ))}
  </>
);
