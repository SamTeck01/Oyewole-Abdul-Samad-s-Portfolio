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
import {Safety3D, Safety3DFrame, ASP3D_DURATION} from './demos/Safety3D';
import {HaixingEN, HaixingFrame, HX_DURATION} from './demos/Haixing';
import {Tunde3DTest} from './demos/Tunde3DTest';
import {PuppetTest} from './demos/PuppetTest';
import {SafetyVideo, SafetyFrame, ASP_DURATION} from './demos/SafetyVideo';

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
    <Composition id="PuppetTest" component={PuppetTest} width={1920} height={1080} fps={60} durationInFrames={60} />
    <Composition id="HaixingEN" component={HaixingEN} width={1920} height={1080} fps={60} durationInFrames={HX_DURATION} />
    <Composition id="HaixingFrame" component={HaixingFrame} width={1920} height={1080} fps={60} durationInFrames={1} defaultProps={{t: 6}} />
    <Composition id="Tunde3DTest" component={Tunde3DTest} width={1920} height={1080} fps={60} durationInFrames={300} />
    <Composition id="Safety3D" component={Safety3D} width={1920} height={1080} fps={60} durationInFrames={ASP3D_DURATION} />
    <Composition id="Safety3DFrame" component={Safety3DFrame} width={1920} height={1080} fps={60} durationInFrames={1} defaultProps={{t: 2}} />
    <Composition id="SafetyVideo" component={SafetyVideo} width={1920} height={1080} fps={60} durationInFrames={ASP_DURATION} />
    <Composition id="SafetyFrame" component={SafetyFrame} width={1920} height={1080} fps={60} durationInFrames={1} defaultProps={{t: 2}} />
  </>
);
