import React from 'react';
import {AbsoluteFill, Img, interpolate, Sequence, Audio, staticFile, useCurrentFrame} from 'remotion';
import {Character} from './Character';
import {body, display, Flag, Glass, GradText, Logo, P, pop, fadeUp, Sky, useLayout, ease} from './ui';

export type SceneProps = {dur: number; voiceFrom: number; voiceDur: number; mouth: (f: number) => number};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const sfx = (name: string, at: number, volume = 0.5) => (
	<Sequence from={Math.max(0, Math.round(at))} durationInFrames={90} key={`${name}${at}`}>
		<Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
	</Sequence>
);

// ---------- 1. Hook: search bar ---------------------------------------------
export const Hook: React.FC<SceneProps> = ({dur}) => {
	const f = useCurrentFrame();
	const {u, portrait, width, height} = useLayout();
	const query = 'Looking for a motion designer who makes ads that sell?';
	const typeStart = 14;
	const cps = 1.25; // chars per frame
	const shown = Math.max(0, Math.min(query.length, Math.floor((f - typeStart) * cps)));
	const typeEnd = typeStart + query.length / cps;
	const barIn = pop(f, 2);
	const barW = portrait ? width * 0.9 : 1250 * u;
	const btn = barW / 2 - 40 * u;
	// cursor travels to the search button, clicks
	const clickAt = Math.min(dur - 26, typeEnd + 22);
	const cx = interpolate(f, [typeEnd, clickAt - 4], [width * 0.15, width / 2 + btn - 6 * u], {...clamp, easing: ease});
	const cy = interpolate(f, [typeEnd, clickAt - 4], [height * 0.85, height / 2 + 10 * u], {...clamp, easing: ease});
	const press = f > clickAt && f < clickAt + 6 ? 0.88 : 1;
	const burst = interpolate(f, [clickAt + 2, dur], [0, 1], {...clamp, easing: ease});
	const fs = (portrait ? 30 : 34) * u;
	return (
		<AbsoluteFill style={{background: '#F5F8FA'}}>
			<AbsoluteFill style={{background: `radial-gradient(70% 60% at 50% 40%, #FFFFFF, #E3ECF5)`}} />
			{new Array(Math.ceil(query.length / 4)).fill(0).map((_, i) => sfx('type', typeStart + (i * 4) / cps, 0.25))}
			{sfx('click', clickAt, 0.6)}
			{sfx('whoosh', clickAt + 4, 0.45)}
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
				<div
					style={{
						...fadeUp(f, 0, 30),
						fontFamily: display,
						fontWeight: 800,
						fontSize: 40 * u,
						color: P.navy,
						marginBottom: 40 * u,
						letterSpacing: 6 * u,
					}}
				>
					SEARCH
				</div>
				<div
					style={{
						width: barW,
						height: 120 * u,
						borderRadius: 60 * u,
						background: '#fff',
						boxShadow: '0 25px 70px rgba(11,35,80,0.18), 0 2px 0 rgba(11,35,80,0.05)',
						transform: `scale(${barIn})`,
						display: 'flex',
						alignItems: 'center',
						padding: `0 ${30 * u}px 0 ${50 * u}px`,
						boxSizing: 'border-box',
						fontFamily: body,
						fontSize: fs,
						color: P.navy,
					}}
				>
					<span style={{flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'clip', minWidth: 0}}>
						{query.slice(0, shown)}
						<span style={{opacity: Math.floor(f / 8) % 2 ? 1 : 0, color: P.blue}}>|</span>
					</span>
					<div
						style={{
							width: 80 * u,
							height: 80 * u,
							borderRadius: 40 * u,
							flexShrink: 0,
							background: `linear-gradient(135deg, ${P.green}, ${P.teal})`,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							transform: `scale(${press})`,
						}}
					>
						<svg width={38 * u} height={38 * u} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round">
							<circle cx={10} cy={10} r={6.5} />
							<path d="M15 15 L21 21" />
						</svg>
					</div>
				</div>
			</AbsoluteFill>
			{/* mouse cursor */}
			<svg
				width={44 * u}
				height={44 * u}
				viewBox="0 0 24 24"
				style={{position: 'absolute', left: cx, top: cy, opacity: f > typeEnd - 4 ? 1 : 0, transform: `scale(${press})`}}
			>
				<path d="M3 2 L3 19 L8 14.5 L11.5 22 L14.5 20.7 L11 13.3 L17.5 13.3 Z" fill={P.navy} stroke="#fff" strokeWidth={1.4} />
			</svg>
			{/* circle burst into the brand world */}
			<AbsoluteFill style={{clipPath: `circle(${burst * 120}% at ${50 + (btn / width) * 100}% 50%)`}}>
				<Sky />
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

// ---------- 2. Intro: avatar badge -------------------------------------------
export const Intro: React.FC<SceneProps> = ({mouth, dur}) => {
	const f = useCurrentFrame();
	const {u, portrait} = useLayout();
	const hi = pop(f, 0, 30, 9);
	const hiOut = interpolate(f, [22, 32], [1, 0], clamp);
	const badge = pop(f, 26, 30, 11);
	const R = (portrait ? 300 : 250) * u;
	const ring = (r: number, speed: number, dash: string, w: number, o: number) => (
		<circle
			cx={0}
			cy={0}
			r={r}
			fill="none"
			stroke="#fff"
			strokeWidth={w}
			strokeDasharray={dash}
			strokeLinecap="round"
			opacity={o}
			transform={`rotate(${f * speed})`}
		/>
	);
	return (
		<AbsoluteFill>
			<Sky />
			{sfx('pop', 1, 0.55)}
			{sfx('pop', 27, 0.5)}
			{sfx('chime', 40, 0.25)}
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
				<div
					style={{
						position: 'absolute',
						fontFamily: display,
						fontWeight: 900,
						fontSize: 300 * u,
						transform: `scale(${hi * (1 + (1 - hiOut) * 0.4)})`,
						opacity: hiOut,
					}}
				>
					<GradText>HI</GradText>
				</div>
				<div
					style={{
						display: 'flex',
						flexDirection: portrait ? 'column' : 'row',
						alignItems: 'center',
						gap: 70 * u,
						opacity: f > 24 ? 1 : 0,
					}}
				>
					<div style={{position: 'relative', width: R * 2.6, height: R * 2.6, transform: `scale(${badge})`}}>
						<svg viewBox={`${-R * 1.3} ${-R * 1.3} ${R * 2.6} ${R * 2.6}`} style={{position: 'absolute', inset: 0}}>
							<defs>
								<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
									<stop offset="0" stopColor={P.green} />
									<stop offset="1" stopColor={P.teal} />
								</linearGradient>
							</defs>
							{ring(R * 1.18, 1.2, `${R * 2.2} ${R * 0.5} ${R * 0.08} ${R * 0.5}`, 4 * u, 0.85)}
							{ring(R * 1.08, -0.8, `${R * 0.9} ${R * 1.4}`, 3 * u, 0.5)}
							<circle r={R} fill="url(#bg)" />
						</svg>
						<div
							style={{
								position: 'absolute',
								left: R * 0.3,
								top: R * 0.3,
								width: R * 2,
								height: R * 2,
								borderRadius: '50%',
								overflow: 'hidden',
							}}
						>
							<Character bust mouth={mouth(f)} style={{width: '100%', height: '100%', transform: 'translateY(6%) scale(1.05)'}} />
						</div>
					</div>
					<div style={{textAlign: portrait ? 'center' : 'left', maxWidth: portrait ? '90vw' : 900 * u}}>
						<div style={{...fadeUp(f, 40), fontFamily: body, fontSize: 34 * u, color: P.mint, letterSpacing: 4 * u, fontWeight: 700}}>
							HI, I'M
						</div>
						<div style={{...fadeUp(f, 46), fontFamily: display, fontWeight: 900, fontSize: 92 * u, lineHeight: 1.02, color: P.white}}>
							Tahir Adewale
							<br />
							<GradText>Oyewole</GradText>
						</div>
						<div
							style={{
								...fadeUp(f, 58),
								marginTop: 26 * u,
								display: 'inline-flex',
								gap: 16 * u,
								alignItems: 'center',
								flexWrap: 'wrap',
								justifyContent: portrait ? 'center' : 'flex-start',
							}}
						>
							<Glass style={{borderRadius: 40 * u, padding: `${14 * u}px ${30 * u}px`, fontFamily: body, fontSize: 32 * u, color: P.white, fontWeight: 500}}>
								Motion Designer
							</Glass>
							<Glass style={{borderRadius: 40 * u, padding: `${14 * u}px ${30 * u}px`, fontFamily: body, fontSize: 32 * u, color: P.white, fontWeight: 500}}>
								Founder of <b style={{color: P.green}}>FDAC</b>
							</Glass>
						</div>
					</div>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

// ---------- 3. Location: skyline -------------------------------------------
export const Location: React.FC<SceneProps> = ({mouth}) => {
	const f = useCurrentFrame();
	const {u, width, height, portrait} = useLayout();
	const wipe = interpolate(f, [0, 16], [0, 1], {...clamp, easing: ease});
	const rise = interpolate(f, [8, 40], [1, 0], {...clamp, easing: ease});
	const ground = height * (portrait ? 0.72 : 0.8);
	// Lagos-style skyline: towers, a tall slim mast building, palms
	const blds = [
		[0.02, 0.2, 0.07], [0.09, 0.32, 0.06], [0.155, 0.24, 0.08], [0.24, 0.45, 0.05], [0.29, 0.3, 0.07],
		[0.37, 0.38, 0.06], [0.44, 0.55, 0.045], [0.49, 0.28, 0.08], [0.58, 0.42, 0.06], [0.65, 0.33, 0.07],
		[0.73, 0.5, 0.05], [0.79, 0.26, 0.08], [0.88, 0.36, 0.06], [0.94, 0.22, 0.07],
	];
	const sh = height * (portrait ? 0.32 : 0.45);
	const pin = pop(f, 30, 30, 8);
	return (
		<AbsoluteFill>
			<Sky tint={0.5} />
			{sfx('whoosh', 0, 0.4)}
			{sfx('pop', 30, 0.45)}
			{/* diagonal stripe wipe, as in the reference reel */}
			<AbsoluteFill style={{overflow: 'hidden', opacity: 1 - wipe}}>
				{new Array(10).fill(0).map((_, i) => (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: (i - 2) * width * 0.16 + wipe * width * 1.4,
							top: -height * 0.2,
							width: width * 0.09,
							height: height * 1.4,
							background: i % 2 ? P.green : P.teal,
							transform: 'rotate(25deg)',
						}}
					/>
				))}
			</AbsoluteFill>
			<svg width={width} height={height} style={{position: 'absolute', transform: `translateY(${rise * sh}px)`}}>
				<defs>
					<linearGradient id="bld" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stopColor="#2D8BD8" />
						<stop offset="1" stopColor={P.navy} />
					</linearGradient>
				</defs>
				{blds.map(([x, h, w], i) => {
					const bx = x * width;
					const bh = h * sh * 1.6;
					const bw = w * width;
					return (
						<g key={i}>
							<rect x={bx} y={ground - bh} width={bw} height={bh} fill="url(#bld)" opacity={0.85} />
							{new Array(Math.floor(bh / (28 * u))).fill(0).map((_, j) => (
								<rect
									key={j}
									x={bx + bw * 0.2}
									y={ground - bh + 16 * u + j * 28 * u}
									width={bw * 0.6}
									height={6 * u}
									fill={P.mint}
									opacity={(i + j) % 3 === 0 ? 0.55 : 0.15}
								/>
							))}
							{i === 6 && <rect x={bx + bw / 2 - 2 * u} y={ground - bh - 80 * u} width={4 * u} height={80 * u} fill={P.mint} />}
						</g>
					);
				})}
				{[0.12, 0.62, 0.9].map((x, i) => (
					<g key={i} transform={`translate(${x * width} ${ground}) scale(${u * 1.2})`}>
						<path d="M0 0 Q4 -60 -2 -120" stroke={P.deep} strokeWidth={8} fill="none" />
						{[-60, -20, 20, 60, 100, 140].map((a) => (
							<path key={a} d={`M-2 -120 q${Math.cos((a * Math.PI) / 180) * 50} ${-20 + Math.sin((a * Math.PI) / 180) * 10} ${Math.cos((a * Math.PI) / 180) * 80} 30`} stroke={P.deep} strokeWidth={9} fill="none" strokeLinecap="round" />
						))}
					</g>
				))}
				<rect x={0} y={ground} width={width} height={height - ground} fill={P.deep} />
				{/* map pin */}
				<g transform={`translate(${width * 0.265} ${ground - sh * 0.74}) scale(${pin * u * 2.2})`}>
					<path d="M0 0 C-22 -30 -30 -42 -30 -58 A30 30 0 0 1 30 -58 C30 -42 22 -30 0 0 Z" fill={P.green} />
					<circle cx={0} cy={-58} r={11} fill="#fff" />
				</g>
			</svg>
			<AbsoluteFill style={{alignItems: 'center', paddingTop: height * (portrait ? 0.1 : 0.1)}}>
				<div style={{...fadeUp(f, 34), fontFamily: display, fontWeight: 900, fontSize: (portrait ? 96 : 110) * u, color: P.white, display: 'flex', alignItems: 'center', gap: 28 * u}}>
					<Flag h={70 * u} /> <GradText>Nigeria</GradText>
				</div>
				<div style={{...fadeUp(f, 44), fontFamily: body, fontSize: 40 * u, color: P.white, opacity: 0.9, marginTop: 14 * u, textAlign: 'center'}}>
					Based in Nigeria · Working with brands worldwide
				</div>
			</AbsoluteFill>
			<div
				style={{
					position: 'absolute',
					right: portrait ? width * 0.05 : width * 0.04,
					bottom: height - ground - 12 * u,
					width: (portrait ? 300 : 260) * u,
					...fadeUp(f, 20, 120, 20),
				}}
			>
				<Character pose="wave" poseT={interpolate(f, [24, 34], [0, 1], clamp)} mouth={mouth(f)} style={{width: '100%'}} />
			</div>
		</AbsoluteFill>
	);
};

// ---------- 4. Specialty: film strip + Pac-Man reveal --------------------------
export const Specialty: React.FC<SceneProps> = ({mouth}) => {
	const f = useCurrentFrame();
	const {u, width, portrait} = useLayout();
	const strip = interpolate(f, [0, 28], [-1, 2.2], {...clamp, easing: ease});
	const eat = interpolate(f, [26, 56], [0, 1], {...clamp, easing: ease});
	const jaw = Math.abs(Math.sin(f / 2.2)) * 38 * (eat < 1 ? 1 : 0);
	const word = 'Motion Graphics';
	const fs = (portrait ? 110 : 140) * u;
	const ballR = fs * 0.55;
	return (
		<AbsoluteFill>
			<Sky />
			{sfx('whoosh', 0, 0.4)}
			{sfx('pop', 58, 0.4)}
			{/* film strip flies through */}
			<div style={{position: 'absolute', top: '22%', left: strip * width - 900 * u, display: 'flex', gap: 8 * u, opacity: 0.9}}>
				{new Array(8).fill(0).map((_, i) => (
					<div key={i} style={{width: 150 * u, height: 110 * u, border: `6px solid ${P.white}`, borderRadius: 8 * u, background: i % 2 ? 'rgba(43,214,123,0.25)' : 'rgba(255,255,255,0.08)'}} />
				))}
			</div>
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 30 * u}}>
				<div style={{...fadeUp(f, 20), fontFamily: body, fontWeight: 700, fontSize: 36 * u, letterSpacing: 6 * u, color: P.mint}}>I CREATE</div>
				<div style={{position: 'relative', fontFamily: display, fontWeight: 900, fontSize: fs, lineHeight: 1.05, textAlign: 'center', color: P.white}}>
					{/* text revealed behind the eater */}
					<span style={{clipPath: `inset(0 ${100 - eat * 100}% 0 0)`, display: 'inline-block', whiteSpace: portrait ? 'normal' : 'nowrap'}}>
						<GradText>{word}</GradText>
					</span>
					<svg
						width={ballR * 2}
						height={ballR * 2}
						viewBox="-50 -50 100 100"
						style={{position: 'absolute', top: '50%', left: `${eat * 100}%`, transform: 'translate(-30%, -50%)', opacity: eat < 1 ? 1 : 0}}
					>
						<path d={`M0 0 L${50 * Math.cos((jaw * Math.PI) / 180)} ${-50 * Math.sin((jaw * Math.PI) / 180)} A50 50 0 1 0 ${50 * Math.cos((jaw * Math.PI) / 180)} ${50 * Math.sin((jaw * Math.PI) / 180)} Z`} fill={P.green} />
					</svg>
				</div>
				<div style={{...fadeUp(f, 56), display: 'flex', gap: 20 * u, flexWrap: 'wrap', justifyContent: 'center'}}>
					{['for Ads', 'that grab attention', 'and make people act'].map((t, i) => (
						<Glass key={t} style={{...fadeUp(f, 56 + i * 10), borderRadius: 50 * u, padding: `${16 * u}px ${34 * u}px`, fontFamily: display, fontWeight: 700, fontSize: 38 * u, color: i === 0 ? P.green : P.white}}>
							{t}
						</Glass>
					))}
				</div>
			</AbsoluteFill>
			<div style={{position: 'absolute', left: portrait ? '6%' : '4%', bottom: portrait ? '3%' : '-4%', width: (portrait ? 230 : 230) * u, ...fadeUp(f, 30, 100)}}>
				<Character pose="thumbs" poseT={interpolate(f, [62, 72], [0, 1], clamp)} mouth={mouth(f)} style={{width: '100%'}} />
			</div>
		</AbsoluteFill>
	);
};

// ---------- 5. Functions: what motion graphics do -----------------------------
const Icon: React.FC<{kind: string; t: number; size: number}> = ({kind, t, size}) => {
	const f = useCurrentFrame();
	const s = {fill: 'none', stroke: '#fff', strokeWidth: 5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
	const k = f / 10;
	return (
		<svg width={size} height={size} viewBox="0 0 100 100">
			{kind === 'explain' && (
				<g {...s}>
					<path d="M50 18 a22 22 0 0 1 13 40 v10 h-26 v-10 a22 22 0 0 1 13 -40 z" />
					<path d="M40 78 h20 M43 86 h14" />
					{[0, 1, 2].map((i) => (
						<path key={i} d={`M${20 + i * 30} ${12 - (i === 1 ? 6 : 0)} l${i === 0 ? -6 : i === 2 ? 6 : 0} -${6 * (0.5 + 0.5 * Math.sin(k + i))}`} stroke={P.green} />
					))}
				</g>
			)}
			{kind === 'advertise' && (
				<g {...s}>
					<path d="M18 42 v18 h12 l30 16 v-50 l-30 16 z" />
					<path d={`M70 40 q${8 + Math.sin(k) * 3} 11 0 22`} stroke={P.green} />
					<path d={`M78 32 q${14 + Math.sin(k + 1) * 3} 19 0 38`} stroke={P.green} />
				</g>
			)}
			{kind === 'brand' && (
				<g {...s}>
					<circle cx={50} cy={50} r={30} strokeDasharray={`${t * 190} 200`} />
					<path d="M38 50 l9 9 l17 -19" stroke={P.green} strokeDasharray="60" strokeDashoffset={60 - t * 60} />
				</g>
			)}
			{kind === 'story' && (
				<g {...s}>
					<rect x={14} y={24} width={72} height={52} rx={8} />
					<path d={`M42 38 l18 12 l-18 12 z`} fill={P.green} stroke={P.green} />
					<path d="M14 88 h72" strokeDasharray="4 8" strokeDashoffset={-f} />
				</g>
			)}
			{kind === 'educate' && (
				<g {...s}>
					<path d="M10 40 l40 -18 l40 18 l-40 18 z" />
					<path d="M28 48 v18 q22 14 44 0 v-18" />
					<path d="M90 40 v22" stroke={P.green} />
				</g>
			)}
			{kind === 'data' && (
				<g {...s}>
					<path d="M14 86 h76" />
					{[0.45, 0.7, 0.55, 0.95].map((h, i) => (
						<rect key={i} x={20 + i * 18} y={86 - h * 60 * t} width={10} height={h * 60 * t} rx={3} fill={i === 3 ? P.green : '#fff'} stroke="none" />
					))}
				</g>
			)}
		</svg>
	);
};

export const Functions: React.FC<SceneProps> = ({mouth, voiceFrom, voiceDur}) => {
	const f = useCurrentFrame();
	const {u, portrait} = useLayout();
	const items = [
		['explain', 'Explain', 'complex ideas'],
		['advertise', 'Advertise', 'your product'],
		['brand', 'Build', 'your brand'],
		['story', 'Tell', 'your story'],
		['educate', 'Educate', 'your audience'],
		['data', 'Present', 'data people remember'],
	];
	// stagger cards across the narration
	const at = (i: number) => voiceFrom + 4 + (i / items.length) * voiceDur * 0.88;
	const cols = portrait ? 2 : 3;
	const cw = (portrait ? 440 : 420) * u;
	return (
		<AbsoluteFill>
			<Sky tint={1} />
			{items.map((_, i) => sfx('pop', at(i), 0.3))}
			<AbsoluteFill style={{flexDirection: portrait ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', gap: 40 * u, paddingTop: portrait ? 120 * u : 0}}>
				{!portrait && (
					<div style={{width: 300 * u, alignSelf: 'flex-end', marginBottom: -60 * u, ...fadeUp(f, 0, 80)}}>
						<Character pose="present" poseT={interpolate(f, [6, 16], [0, 1], clamp)} mouth={mouth(f)} style={{width: '100%'}} />
					</div>
				)}
				<div style={{display: 'flex', flexDirection: 'column', gap: 34 * u, alignItems: portrait ? 'center' : 'flex-start'}}>
					<div style={{...fadeUp(f, 0), fontFamily: display, fontWeight: 900, fontSize: (portrait ? 70 : 76) * u, color: P.white, lineHeight: 1.05, textAlign: portrait ? 'center' : 'left'}}>
						What motion graphics
						<br />
						<GradText>do for your brand</GradText>
					</div>
					<div style={{display: 'grid', gridTemplateColumns: `repeat(${cols}, ${cw}px)`, gap: 24 * u}}>
						{items.map(([k, a, b], i) => {
							const p = pop(f, at(i), 30, 12);
							const t = interpolate(f, [at(i), at(i) + 24], [0, 1], clamp);
							const active = f >= at(i) && (i === items.length - 1 || f < at(i + 1));
							return (
								<Glass
									key={k}
									style={{
										borderRadius: 28 * u,
										padding: `${22 * u}px ${26 * u}px`,
										display: 'flex',
										alignItems: 'center',
										gap: 20 * u,
										transform: `scale(${p}) translateY(${active ? -6 * u : 0}px)`,
										opacity: p,
										borderColor: active ? P.green : P.glassLine,
									}}
								>
									<div style={{width: 92 * u, height: 92 * u, borderRadius: 24 * u, background: `linear-gradient(135deg, ${P.teal}, ${P.blue})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
										<Icon kind={k} t={t} size={66 * u} />
									</div>
									<div style={{minWidth: 0}}>
										<div style={{fontFamily: display, fontWeight: 800, fontSize: 38 * u, color: P.white}}>{a}</div>
										<div style={{fontFamily: body, fontSize: 26 * u, color: P.mint}}>{b}</div>
									</div>
								</Glass>
							);
						})}
					</div>
				</div>
				{portrait && (
					<div style={{width: 280 * u, ...fadeUp(f, 0, 80)}}>
						<Character pose="present" poseT={interpolate(f, [6, 16], [0, 1], clamp)} mouth={mouth(f)} bust style={{width: '100%'}} />
					</div>
				)}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

// ---------- 6. Why: motion stops the scroll -----------------------------------
export const Why: React.FC<SceneProps> = ({mouth, dur}) => {
	const f = useCurrentFrame();
	const {u, portrait} = useLayout();
	const stopAt = 45;
	// scroll fast, then ease to a stop on our card
	const scroll = interpolate(f, [0, stopAt], [0, 1], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3)});
	const ph = 820 * u;
	const pw = 420 * u;
	const card = 260 * u;
	const total = card * 9;
	const y = -scroll * total + card * 1.2;
	const glow = interpolate(f, [stopAt, stopAt + 10], [0, 1], clamp);
	return (
		<AbsoluteFill>
			<Sky />
			{sfx('whoosh', 2, 0.35)}
			{sfx('chime', stopAt, 0.3)}
			<AbsoluteFill style={{flexDirection: portrait ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', gap: 90 * u}}>
				<div style={{...fadeUp(f, 0, 60), width: pw, height: ph, borderRadius: 60 * u, background: '#0A1428', border: `10px solid #1A2A48`, overflow: 'hidden', position: 'relative', boxShadow: '0 40px 90px rgba(0,0,0,0.5)', transform: `scale(${portrait ? 0.85 : 1})`}}>
					<div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', flexDirection: 'column', gap: 20 * u, padding: 20 * u}}>
						{new Array(10).fill(0).map((_, i) => {
							const ours = i === 8;
							return (
								<div
									key={i}
									style={{
										height: card - 20 * u,
										borderRadius: 22 * u,
										background: ours ? `linear-gradient(135deg, ${P.blue}, ${P.teal} 60%, ${P.green})` : '#22314F',
										filter: ours ? 'none' : `blur(${(1 - scroll) * 6}px)`,
										boxShadow: ours ? `0 0 ${60 * glow * u}px rgba(43,214,123,${0.8 * glow})` : 'none',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										transform: ours ? `scale(${1 + glow * 0.04})` : 'none',
									}}
								>
									{ours ? (
										<svg width={180 * u} height={140 * u} viewBox="0 0 180 140">
											{[0, 1, 2].map((j) => (
												<circle key={j} cx={40 + j * 50} cy={70 + Math.sin(f / 6 + j) * 24} r={18} fill="#fff" opacity={0.95 - j * 0.2} />
											))}
										</svg>
									) : (
										<div style={{width: '70%'}}>
											<div style={{height: 18 * u, background: '#33456A', borderRadius: 9 * u, marginBottom: 12 * u}} />
											<div style={{height: 18 * u, width: '60%', background: '#33456A', borderRadius: 9 * u}} />
										</div>
									)}
								</div>
							);
						})}
					</div>
				</div>
				<div style={{maxWidth: (portrait ? 900 : 760) * u, textAlign: portrait ? 'center' : 'left'}}>
					<div style={{...fadeUp(f, 6), fontFamily: display, fontWeight: 900, fontSize: (portrait ? 96 : 104) * u, color: P.white, lineHeight: 1.02}}>
						Motion
						<br />
						<GradText>stops the scroll.</GradText>
					</div>
					<div style={{...fadeUp(f, stopAt), fontFamily: body, fontSize: 40 * u, color: P.white, opacity: 0.88, marginTop: 24 * u}}>
						Movement catches the eye and makes your message impossible to ignore.
					</div>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

// ---------- 7. Featured work: FDAC launch ad --------------------------------
export const Work: React.FC<SceneProps> = ({dur}) => {
	const f = useCurrentFrame();
	const {u, portrait, width} = useLayout();
	const shots = ['work1.png', 'work2.png', 'work3.png', 'work4.png'];
	const per = (dur - 20) / shots.length;
	const sw = portrait ? width * 0.9 : 1200 * u;
	const sh = sw * (1013 / 1919);
	const tilt = interpolate(f, [0, 30], [18, 0], {...clamp, easing: ease});
	return (
		<AbsoluteFill>
			<Sky />
			{sfx('whoosh', 0, 0.4)}
			{shots.map((_, i) => (i > 0 ? sfx('whoosh', 10 + i * per - 6, 0.2) : null))}
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 34 * u}}>
				<div style={{...fadeUp(f, 0), display: 'flex', alignItems: 'center', gap: 18 * u}}>
					<div style={{width: 14 * u, height: 14 * u, borderRadius: 7 * u, background: P.green, boxShadow: `0 0 ${16 * u}px ${P.green}`}} />
					<span style={{fontFamily: body, fontWeight: 700, fontSize: 32 * u, letterSpacing: 6 * u, color: P.mint}}>FEATURED WORK</span>
				</div>
				<div style={{perspective: 1600 * u}}>
					<div
						style={{
							width: sw,
							height: sh,
							borderRadius: 26 * u,
							overflow: 'hidden',
							position: 'relative',
							border: `${8 * u}px solid rgba(255,255,255,0.85)`,
							boxShadow: '0 50px 120px rgba(2,10,30,0.6)',
							transform: `rotateX(${tilt}deg) scale(${interpolate(f, [0, 30], [0.85, 1], {...clamp, easing: ease})})`,
						}}
					>
						{shots.map((s, i) => {
							const st = 10 + i * per;
							const o = interpolate(f, [st - 8, st + 2], [0, 1], clamp);
							const z = interpolate(f, [st - 8, st + per + 8], [1.0, 1.08], clamp);
							return (
								<Img
									key={s}
									src={staticFile(s)}
									style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: i === 0 ? 1 : o, transform: `scale(${z})`}}
								/>
							);
						})}
						{/* progress bar like a video player */}
						<div style={{position: 'absolute', left: 0, bottom: 0, height: 8 * u, width: `${(f / dur) * 100}%`, background: `linear-gradient(90deg, ${P.teal}, ${P.green})`}} />
					</div>
				</div>
				<div style={{...fadeUp(f, 20), textAlign: 'center'}}>
					<div style={{fontFamily: display, fontWeight: 900, fontSize: 64 * u, color: P.white}}>
						FDAC <GradText>Launch Ad</GradText>
					</div>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

// ---------- 8. FDAC meaning --------------------------------------------------
export const Fdac: React.FC<SceneProps> = ({voiceFrom}) => {
	const f = useCurrentFrame();
	const {u, portrait} = useLayout();
	const logoIn = pop(f, 0, 30, 12);
	const words = [
		['F', 'Focus'],
		['D', 'Discipline'],
		['A', 'And'],
		['C', 'Consistency'],
	];
	// roughly when each word is spoken
	const at = [voiceFrom + 2, voiceFrom + 26, voiceFrom + 52, voiceFrom + 62];
	return (
		<AbsoluteFill>
			<Sky tint={1} />
			{sfx('chime', 2, 0.25)}
			{at.map((a, i) => (i === 2 ? null : sfx('pop', a, 0.35)))}
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 50 * u}}>
				<div style={{transform: `scale(${logoIn})`, background: 'rgba(255,255,255,0.95)', borderRadius: 40 * u, padding: `${24 * u}px ${36 * u}px`, boxShadow: '0 30px 80px rgba(0,0,0,0.35)'}}>
					<Logo size={(portrait ? 300 : 240) * u} />
				</div>
				<div style={{display: 'grid', gridTemplateColumns: portrait ? 'repeat(2, auto)' : 'repeat(4, auto)', gap: `${30 * u}px ${60 * u}px`}}>
					{words.map(([l, w], i) => {
						const on = interpolate(f, [at[i], at[i] + 10], [0, 1], clamp);
						return (
							<div key={w} style={{textAlign: 'center', opacity: 0.35 + on * 0.65, transform: `translateY(${(1 - on) * 14}px)`}}>
								<div style={{fontFamily: display, fontWeight: 900, fontSize: 150 * u, lineHeight: 1, color: on > 0.5 ? undefined : P.white}}>
									{on > 0.5 ? <GradText>{l}</GradText> : l}
								</div>
								<div style={{fontFamily: display, fontWeight: 700, fontSize: 40 * u, color: P.white, marginTop: 6 * u}}>{w}</div>
								<div style={{height: 6 * u, marginTop: 12 * u, borderRadius: 3 * u, background: `linear-gradient(90deg, ${P.teal}, ${P.green})`, transform: `scaleX(${on})`}} />
							</div>
						);
					})}
				</div>
				<div style={{...fadeUp(f, at[3] + 20), fontFamily: body, fontSize: 38 * u, color: P.white, opacity: 0.9, textAlign: 'center'}}>
					How I run my own work, and how I'll handle yours.
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

// ---------- 9. Call to action + 10. end card ---------------------------------
const WhatsApp: React.FC<{size: number}> = ({size}) => (
	<svg width={size} height={size} viewBox="0 0 32 32">
		<circle cx={16} cy={16} r={16} fill="#25D366" />
		<path d="M9 23 l1.2 -3.6 a7.5 7.5 0 1 1 2.6 2.5 z" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinejoin="round" />
		<path d="M13.2 12.6 c.3 2.4 2 4.3 4.6 5.2 l1-1.1 1.6.8 c-.2 1-1 1.6-2 1.5 -3.1-.4-5.8-3.1-6.2-6.2 -.1-1 .5-1.8 1.5-2 l.8 1.6z" fill="#fff" />
	</svg>
);

const Contacts: React.FC<{start: number}> = ({start}) => {
	const f = useCurrentFrame();
	const {u, portrait} = useLayout();
	const pulse = 1 + Math.max(0, Math.sin((f - start) / 7)) * 0.03;
	return (
		<div style={{display: 'flex', flexDirection: portrait ? 'column' : 'row', gap: 26 * u, alignItems: 'center'}}>
			<div
				style={{
					...fadeUp(f, start),
					display: 'flex',
					alignItems: 'center',
					gap: 22 * u,
					background: 'linear-gradient(135deg, #25D366, #1DB954)',
					borderRadius: 70 * u,
					padding: `${20 * u}px ${44 * u}px ${20 * u}px ${22 * u}px`,
					boxShadow: `0 20px 60px rgba(37,211,102,0.45)`,
					transform: `scale(${f > start + 16 ? pulse : 1})`,
				}}
			>
				<div style={{background: '#fff', borderRadius: '50%', padding: 6 * u, display: 'flex'}}>
					<WhatsApp size={70 * u} />
				</div>
				<div>
					<div style={{fontFamily: body, fontWeight: 700, fontSize: 26 * u, color: '#E9FFF1', letterSpacing: 2 * u}}>CHAT ON WHATSAPP</div>
					<div style={{fontFamily: display, fontWeight: 800, fontSize: 52 * u, color: '#fff', fontVariantNumeric: 'tabular-nums'}}>+234 905 063 6601</div>
				</div>
			</div>
			<Glass style={{...fadeUp(f, start + 10), borderRadius: 70 * u, padding: `${26 * u}px ${40 * u}px`, display: 'flex', alignItems: 'center', gap: 18 * u}}>
				<svg width={50 * u} height={50 * u} viewBox="0 0 24 24" fill="none" stroke={P.green} strokeWidth={2} strokeLinejoin="round">
					<rect x={3} y={5} width={18} height={14} rx={3} />
					<path d="M3.5 6.5 L12 13 L20.5 6.5" />
				</svg>
				<span style={{fontFamily: display, fontWeight: 700, fontSize: 40 * u, color: P.white}}>tahiroyewole@gmail.com</span>
			</Glass>
		</div>
	);
};

export const Cta: React.FC<SceneProps> = ({mouth, voiceFrom, voiceDur}) => {
	const f = useCurrentFrame();
	const {u, portrait} = useLayout();
	const cStart = voiceFrom + voiceDur * 0.55;
	return (
		<AbsoluteFill>
			<Sky tint={0.6} />
			{sfx('whoosh', 0, 0.4)}
			{sfx('chime', cStart, 0.3)}
			<AbsoluteFill style={{flexDirection: portrait ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', gap: 60 * u}}>
				<div style={{width: (portrait ? 320 : 330) * u, ...fadeUp(f, 0, 80), order: portrait ? 2 : 0}}>
					<Character pose="wave" poseT={interpolate(f, [4, 14], [0, 1], clamp)} mouth={mouth(f)} style={{width: '100%'}} />
				</div>
				<div style={{display: 'flex', flexDirection: 'column', gap: 44 * u, alignItems: portrait ? 'center' : 'flex-start'}}>
					<div style={{...fadeUp(f, 4), fontFamily: display, fontWeight: 900, fontSize: (portrait ? 98 : 110) * u, color: P.white, lineHeight: 1.02, textAlign: portrait ? 'center' : 'left'}}>
						Let's put your
						<br />
						<GradText>brand in motion.</GradText>
					</div>
					<Contacts start={cStart} />
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

export const End: React.FC<SceneProps> = () => {
	const f = useCurrentFrame();
	const {u, portrait} = useLayout();
	const b = pop(f, 0, 30, 12);
	const R = 150 * u;
	return (
		<AbsoluteFill>
			<Sky tint={1} />
			{sfx('pop', 0, 0.4)}
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 36 * u}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 40 * u, flexDirection: portrait ? 'column' : 'row', transform: `scale(${b})`}}>
					<div style={{position: 'relative', width: R * 2, height: R * 2}}>
						<svg viewBox="-160 -160 320 320" style={{position: 'absolute', inset: -R * 0.12, width: R * 2.24, height: R * 2.24}}>
							<circle r={150} fill="none" stroke="#fff" strokeWidth={4} strokeDasharray="300 60 10 60" transform={`rotate(${f * 1.4})`} strokeLinecap="round" />
						</svg>
						<div style={{position: 'absolute', inset: R * 0.08, borderRadius: '50%', overflow: 'hidden', background: `linear-gradient(135deg, ${P.green}, ${P.teal})`}}>
							<Character bust style={{width: '100%', height: '100%', transform: 'translateY(6%) scale(1.05)'}} />
						</div>
					</div>
					<div style={{textAlign: portrait ? 'center' : 'left'}}>
						<div style={{fontFamily: display, fontWeight: 900, fontSize: 72 * u, color: P.white, lineHeight: 1.05}}>
							Tahir Adewale <GradText>Oyewole</GradText>
						</div>
						<div style={{fontFamily: body, fontSize: 34 * u, color: P.mint, marginTop: 8 * u}}>Motion Designer · Founder of FDAC</div>
					</div>
				</div>
				<Contacts start={6} />
				<div style={{...fadeUp(f, 16), display: 'flex', alignItems: 'center', gap: 18 * u, marginTop: 10 * u}}>
					<div style={{background: 'rgba(255,255,255,0.95)', borderRadius: 14 * u, padding: `${6 * u}px ${12 * u}px`}}>
						<Logo size={70 * u} />
					</div>
					<span style={{fontFamily: body, fontSize: 28 * u, color: P.white, opacity: 0.85, letterSpacing: 2 * u}}>
						Focus · Discipline · And · Consistency
					</span>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
