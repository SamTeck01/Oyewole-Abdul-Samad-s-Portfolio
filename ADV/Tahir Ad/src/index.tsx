import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Ad, AdProps} from './Ad';
import timings from './timings.json';
import timings60 from './timings_60.json';

const full: AdProps = {timings, vo: 'vo/full.wav', music: 'sfx/music.wav'};
// 60 s cut for WhatsApp Status (one clip, no split): see scripts/tts.py CUTS.
const cut60: AdProps = {timings: timings60, vo: 'vo_60/full.wav', music: 'sfx/music_60.wav'};

const Root: React.FC = () => (
	<>
		<Composition id="TahirAd" component={Ad} defaultProps={full} durationInFrames={timings.total} fps={30} width={1920} height={1080} />
		<Composition id="TahirAdVertical" component={Ad} defaultProps={full} durationInFrames={timings.total} fps={30} width={1080} height={1920} />
		<Composition id="TahirAd60Vertical" component={Ad} defaultProps={cut60} durationInFrames={timings60.total} fps={30} width={1080} height={1920} />
	</>
);

registerRoot(Root);
