import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import full from './timings.json';

export type Timings = typeof full;
export type AdProps = {timings: Timings; vo: string; music: string};
import {Cta, End, Fdac, Functions, Hook, Intro, Location, SceneProps, Specialty, Why, Work} from './Scenes';
import {body, P, useLayout} from './ui';

const SCENES: Record<string, React.FC<SceneProps>> = {
	hook: Hook,
	intro: Intro,
	location: Location,
	specialty: Specialty,
	functions: Functions,
	why: Why,
	work: Work,
	fdac: Fdac,
	cta: Cta,
	end: End,
};

// Captions: split each line into short chunks, spread across the spoken time.
const Captions: React.FC<{timings: Timings}> = ({timings}) => {
	const f = useCurrentFrame();
	const {u, portrait} = useLayout();
	const s = timings.scenes.find((x) => f >= x.from && f < x.from + x.dur);
	if (!s || !s.text) return null;
	const local = f - s.from - s.voiceFrom;
	if (local < 0 || local > s.voiceDur + 8) return null;
	const words = s.text.replace(/F\.D\.A\.C/g, 'FDAC').split(' ');
	const size = portrait ? 5 : 7;
	const chunks: string[] = [];
	for (let i = 0; i < words.length; i += size) chunks.push(words.slice(i, i + size).join(' '));
	// weight chunk time by character count
	const lens = chunks.map((c) => c.length);
	const tot = lens.reduce((a, b) => a + b, 0);
	let acc = 0;
	let idx = chunks.length - 1;
	for (let i = 0; i < chunks.length; i++) {
		acc += (lens[i] / tot) * s.voiceDur;
		if (local < acc) {
			idx = i;
			break;
		}
	}
	return (
		<AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: (portrait ? 150 : 46) * u}}>
			<div
				style={{
					fontFamily: body,
					fontWeight: 700,
					fontSize: (portrait ? 42 : 36) * u,
					color: '#fff',
					background: 'rgba(4,14,34,0.62)',
					padding: `${10 * u}px ${24 * u}px`,
					borderRadius: 14 * u,
					maxWidth: '86%',
					textAlign: 'center',
				}}
			>
				{chunks[idx]}
			</div>
		</AbsoluteFill>
	);
};

export const Ad: React.FC<AdProps> = ({timings, vo, music}) => {
	const total = timings.total;
	const mouthAt = (abs: number) => timings.mouth[abs] ?? 0;
	return (
		<AbsoluteFill style={{background: P.deep}}>
			{timings.scenes.map((s) => {
				const Comp = SCENES[s.id];
				return (
					<Sequence key={s.id} from={s.from} durationInFrames={s.dur} name={s.id}>
						<Comp dur={s.dur} voiceFrom={s.voiceFrom} voiceDur={s.voiceDur} mouth={(f) => mouthAt(s.from + f)} />
					</Sequence>
				);
			})}
			<Captions timings={timings} />
			<Audio src={staticFile(vo)} volume={1} />
			<Audio
				src={staticFile(music)}
				// sit low under the voice, lift on the silent end card
				volume={(f) => interpolate(f, [0, 20, total - 220, total - 190, total - 30, total], [0, 0.22, 0.22, 0.5, 0.5, 0], {extrapolateRight: 'clamp'})}
			/>
		</AbsoluteFill>
	);
};
