import React from 'react';
import {Composition} from 'remotion';
import {StyleTest, STYLE_TEST_FRAMES} from './StyleTest';

export const Root: React.FC = () => (
  <Composition id="StyleTest" component={StyleTest} durationInFrames={STYLE_TEST_FRAMES} fps={60} width={1920} height={1080} />
);
