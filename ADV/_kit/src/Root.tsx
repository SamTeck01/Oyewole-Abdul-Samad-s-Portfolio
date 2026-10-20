import React from 'react';
import {Composition} from 'remotion';
import {loadFonts} from './kit/fonts';
import {HaloScore} from './demos/HaloScore';
import {PulseStory} from './demos/PulseStory';

loadFonts();

export const Root: React.FC = () => (
  <>
    {/* Rebuild of reference 05 (score-pill template), 16:9 */}
    <Composition id="HaloScore" component={HaloScore} width={1920} height={1080} fps={60} durationInFrames={660} />
    {/* Rebuild of reference 17 (VO-driven caption template), 9:16 */}
    <Composition id="PulseStory" component={PulseStory} width={1080} height={1920} fps={60} durationInFrames={840} />
  </>
);
