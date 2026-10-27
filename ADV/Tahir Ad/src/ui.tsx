import React from 'react';
import {AbsoluteFill, Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {loadFont} from '@remotion/fonts';

// Fonts ship with the project (public/fonts) so renders never depend on the network.
for (const w of ['600', '700', '800', '900']) loadFont({family: 'Montserrat', url: staticFile(`fonts/Montserrat-${w}.woff2`), weight: w});
for (const w of ['400', '500', '700']) loadFont({family: 'DM Sans', url: staticFile(`fonts/DMSans-${w}.woff2`), weight: w});
export const display = 'Montserrat, sans-serif';
export const body = '"DM Sans", sans-serif';

// FDAC brand palette, taken from the logo and the launch ad.
export const P = {
	navy: '#0B2350',
	deep: '#071937',
	blue: '#1C6FD8',
	sky: '#2E9BF0',
	teal: '#0A9FB4',
	green: '#2BD67B',
	mint: '#9BF0C8',
	white: '#F5F8FA',
	glass: 'rgba(255,255,255,0.12)',
	glassLine: 'rgba(255,255,255,0.28)',
};
export const GRAD = `linear-gradient(100deg, ${P.white} 0%, #CFE8FF 40%, ${P.mint} 75%, ${P.green} 100%)`;

export const useLayout = () => {
	const {width, height} = useVideoConfig();
	const portrait = height > width;
	const u = Math.min(width, height) / 1080; // 1 unit = 1px on the short side of 1080
	return {width, height, portrait, u};
};

export const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const pop = (f: number, at: number, fps = 30, damping = 12) =>
	spring({frame: f - at, fps, config: {damping, stiffness: 140, mass: 0.7}});

export const fadeUp = (f: number, at: number, dist = 40, len = 16) => {
	const t = interpolate(f, [at, at + len], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
	return {opacity: t, transform: `translateY(${(1 - t) * dist}px)`};
};

export const GradText: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
	<span
		style={{
			background: GRAD,
			WebkitBackgroundClip: 'text',
			backgroundClip: 'text',
			color: 'transparent',
			...style,
		}}
	>
		{children}
	</span>
);

// Deep blue sky with drifting stars, like the FDAC launch ad.
export const Sky: React.FC<{tint?: number}> = ({tint = 0}) => {
	const f = useCurrentFrame();
	const {width, height} = useLayout();
	const stars = new Array(70).fill(0).map((_, i) => ({
		x: random(`x${i}`) * width,
		y: random(`y${i}`) * height,
		r: 0.8 + random(`r${i}`) * 2.2,
		tw: random(`t${i}`) * 6.28,
	}));
	return (
		<AbsoluteFill
			style={{
				background: `radial-gradient(120% 90% at 50% 115%, ${P.sky} 0%, ${P.blue} 35%, ${P.navy} 75%, ${P.deep} 100%)`,
			}}
		>
			<AbsoluteFill
				style={{
					background: `radial-gradient(60% 50% at ${80 - tint * 30}% 0%, rgba(43,214,123,0.22), transparent 70%)`,
				}}
			/>
			<svg width={width} height={height} style={{position: 'absolute'}}>
				{stars.map((s, i) => (
					<circle
						key={i}
						cx={(s.x + f * 0.15 * (s.r / 2)) % width}
						cy={s.y}
						r={s.r}
						fill="#fff"
						opacity={0.25 + 0.35 * (0.5 + 0.5 * Math.sin(f / 20 + s.tw))}
					/>
				))}
			</svg>
		</AbsoluteFill>
	);
};

export const Glass: React.FC<{style?: React.CSSProperties; children?: React.ReactNode}> = ({style, children}) => (
	<div
		style={{
			background: 'linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.07))',
			border: `1.5px solid ${P.glassLine}`,
			boxShadow: '0 20px 60px rgba(4,16,40,0.45), inset 0 1px 0 rgba(255,255,255,0.35)',
			backdropFilter: 'blur(14px)',
			...style,
		}}
	>
		{children}
	</div>
);

export const Logo: React.FC<{size: number; style?: React.CSSProperties}> = ({size, style}) => (
	<Img src={staticFile('logo.png')} style={{width: size, height: size * (1182 / 1331), ...style}} />
);

// Nigeria flag drawn as shapes (no emoji fonts in the renderer).
export const Flag: React.FC<{h: number}> = ({h}) => (
	<svg width={h * 1.5} height={h} viewBox="0 0 3 2" style={{borderRadius: h * 0.12, display: 'inline-block'}}>
		<rect width={1} height={2} fill="#008751" />
		<rect x={1} width={1} height={2} fill="#fff" />
		<rect x={2} width={1} height={2} fill="#008751" />
	</svg>
);
