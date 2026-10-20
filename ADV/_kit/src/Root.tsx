import React from 'react';
import {Composition} from 'remotion';
import {loadFonts} from './kit/fonts';
import {HaloScore} from './demos/HaloScore';
import {PulseStory} from './demos/PulseStory';
import {PulseWide} from './demos/PulseWide';
import {CharTest} from './demos/CharTest';
import {LottieGrid} from './demos/LottieGrid';
import {SceneTest} from './demos/SceneTest';
import {SafetyStill} from './demos/SafetyStill';

loadFonts();

export const Root: React.FC = () => (
  <>
    {/* Rebuild of reference 05 (score-pill template), 16:9 */}
    <Composition id="HaloScore" component={HaloScore} width={1920} height={1080} fps={60} durationInFrames={660} />
    {/* Rebuild of reference 17 (VO-driven caption template), 9:16 */}
    <Composition id="PulseStory" component={PulseStory} width={1080} height={1920} fps={60} durationInFrames={840} />
    <Composition id="PulseWide" component={PulseWide} width={1920} height={1080} fps={60} durationInFrames={840} />
    <Composition id="CharTest" component={CharTest} width={1920} height={1080} fps={60} durationInFrames={480} />
    <Composition id="LottieGrid" component={LottieGrid} width={1920} height={1080} fps={30} durationInFrames={300} defaultProps={{prefix: 'c', count: 9}} />
    <Composition id="SceneTest" component={SceneTest} width={1920} height={1080} fps={60} durationInFrames={300} />
    <Composition id="SafetyStill" component={SafetyStill} width={1920} height={1080} fps={60} durationInFrames={120} defaultProps={{pose: 2}} />
  </>
);
