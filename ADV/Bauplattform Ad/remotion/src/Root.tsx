import React from 'react';
import {Composition} from 'remotion';
import {StyleTest, STYLE_TEST_FRAMES} from './StyleTest';
import {Film, FILM_SECONDS} from './Film';

const frames = Math.round(FILM_SECONDS * 60);

export const Root: React.FC = () => (
  <>
    <Composition id="Film-EN" component={Film} defaultProps={{lang: 'en' as const}} durationInFrames={frames} fps={60} width={1920} height={1080} />
    <Composition id="Film-DE" component={Film} defaultProps={{lang: 'de' as const}} durationInFrames={frames} fps={60} width={1920} height={1080} />
    <Composition id="StyleTest" component={StyleTest} durationInFrames={STYLE_TEST_FRAMES} fps={60} width={1920} height={1080} />
  </>
);
