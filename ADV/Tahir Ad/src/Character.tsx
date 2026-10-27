import React from 'react';
import {useCurrentFrame} from 'remotion';

// Tahir: flat vector character. Short dark hair with height on top, deep brown
// skin, mint-teal striped top, navy jeans, grey sneakers.
export const C = {
	skin: '#6B4430',
	skinShade: '#55341F',
	hair: '#16161C',
	top: '#8ED9C8',
	topShade: '#6FC2B0',
	stripe: '#E9F7F3',
	jeans: '#1D2B4F',
	jeansShade: '#162140',
	shoe: '#AEB6C2',
	sole: '#E8ECF1',
	mouth: '#2E140C',
};

export type Pose = 'idle' | 'wave' | 'point' | 'present' | 'thumbs';

type Props = {
	mouth?: number; // 0..1 how open
	pose?: Pose;
	poseT?: number; // 0..1 blend into the pose
	bust?: boolean; // head and shoulders only (for badges)
	smile?: boolean;
	style?: React.CSSProperties;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const Character: React.FC<Props> = ({mouth = 0, pose = 'idle', poseT = 1, bust = false, smile = true, style}) => {
	const f = useCurrentFrame();
	const breathe = Math.sin(f / 18) * 3;
	// blink every ~3.4 s for 4 frames
	const blink = f % 102 < 4 ? 0.12 : 1;
	const sway = Math.sin(f / 9);

	// arm angles (degrees, 0 = hanging down). Right = viewer's right.
	let rTarget = 8;
	let lTarget = -8;
	let rElbow = 0;
	if (pose === 'wave') {
		rTarget = -150 + sway * 14;
		rElbow = -20;
	} else if (pose === 'point') {
		rTarget = -95;
		rElbow = 0;
	} else if (pose === 'present') {
		rTarget = -55;
		lTarget = 55;
		rElbow = -25;
	} else if (pose === 'thumbs') {
		rTarget = -40;
		rElbow = -100;
	}
	const rArm = lerp(8, rTarget, poseT);
	const lArm = lerp(-8, lTarget, poseT);
	const rEl = lerp(0, rElbow, poseT);

	const mo = Math.max(0, Math.min(1, mouth));
	const vb = bust ? '60 40 280 340' : '0 0 400 1000';

	const arm = (side: 'l' | 'r', angle: number, elbow: number) => {
		const x = side === 'l' ? 112 : 288;
		const dir = side === 'l' ? -1 : 1;
		return (
			<g transform={`rotate(${angle} ${x} 335)`}>
				{/* upper sleeve */}
				<rect x={x - 26} y={320} width={52} height={150} rx={26} fill={C.top} />
				<rect x={x - 26 + (dir > 0 ? 30 : 0)} y={330} width={22} height={130} rx={11} fill={C.topShade} opacity={0.6} />
				<g transform={`rotate(${elbow * dir * -1} ${x} 450)`}>
					<rect x={x - 23} y={440} width={46} height={120} rx={23} fill={C.top} />
					<rect x={x - 23} y={536} width={46} height={14} rx={6} fill={C.stripe} />
					{/* hand */}
					<ellipse cx={x} cy={578} rx={22} ry={25} fill={C.skin} />
					<ellipse cx={x + dir * 14} cy={568} rx={8} ry={13} fill={C.skin} />
				</g>
			</g>
		);
	};

	return (
		<svg viewBox={vb} style={{overflow: 'visible', ...style}}>
			<g transform={`translate(0 ${breathe * 0.4})`}>
				{!bust && (
					<g>
						{/* legs */}
						<path d="M140 600 L140 905 Q140 915 150 915 L192 915 Q198 915 198 905 L200 640 L202 905 Q202 915 208 915 L250 915 Q260 915 260 905 L260 600 Z" fill={C.jeans} />
						<path d="M200 640 L198 905 L186 905 L190 650 Z" fill={C.jeansShade} />
						{/* shoes */}
						<path d="M132 905 Q132 935 160 935 L205 935 Q205 912 190 905 Z" fill={C.shoe} />
						<path d="M268 905 Q268 935 240 935 L195 935 Q195 912 210 905 Z" fill={C.shoe} />
						<rect x={128} y={930} width={80} height={10} rx={5} fill={C.sole} />
						<rect x={192} y={930} width={80} height={10} rx={5} fill={C.sole} />
					</g>
				)}
				{/* back arm */}
				{arm('l', lArm, 0)}
				{/* torso */}
				<g transform={`translate(0 ${breathe * 0.3})`}>
					<path d="M200 292 C150 292 110 305 100 345 L112 615 Q114 625 125 625 L275 625 Q286 625 288 615 L300 345 C290 305 250 292 200 292 Z" fill={C.top} />
					<path d="M250 300 C275 310 296 325 300 345 L288 615 Q286 625 275 625 L250 625 Z" fill={C.topShade} opacity={0.5} />
					<rect x={104} y={430} width={192} height={12} fill={C.stripe} />
					<rect x={106} y={452} width={190} height={6} fill={C.stripe} opacity={0.8} />
					<rect x={112} y={600} width={176} height={18} rx={6} fill={C.topShade} />
					{/* collar */}
					<path d="M168 296 Q200 336 232 296" fill="none" stroke={C.stripe} strokeWidth={9} strokeLinecap="round" />
				</g>
				{arm('r', rArm, rEl)}
				{/* neck */}
				<rect x={180} y={252} width={40} height={50} rx={12} fill={C.skinShade} />
				{/* head */}
				<g transform={`translate(0 ${breathe * 0.2}) rotate(${Math.sin(f / 40) * 1.5} 200 260)`}>
					<ellipse cx={124} cy={182} rx={14} ry={20} fill={C.skinShade} />
					<ellipse cx={276} cy={182} rx={14} ry={20} fill={C.skinShade} />
					<path d="M200 70 C255 70 278 110 278 170 C278 228 245 268 200 270 C155 268 122 228 122 170 C122 110 145 70 200 70 Z" fill={C.skin} />
					{/* jaw shade */}
					<path d="M248 220 C238 250 222 266 200 270 C230 262 256 236 266 196 Z" fill={C.skinShade} opacity={0.55} />
					{/* hair: close at the sides, height on top */}
					<path d="M120 168 C114 110 134 52 200 48 C268 46 290 108 280 168 C274 140 268 118 256 108 C230 96 172 96 146 108 C132 118 126 140 120 168 Z" fill={C.hair} />
					<path d="M140 92 C160 60 240 56 262 92" fill="none" stroke="#2A2A33" strokeWidth={4} strokeDasharray="2 9" strokeLinecap="round" />
					{/* brows */}
					<rect x={148} y={146} width={34} height={7} rx={3.5} fill={C.hair} />
					<rect x={218} y={146} width={34} height={7} rx={3.5} fill={C.hair} />
					{/* eyes */}
					<g transform={`translate(0 ${172 * (1 - blink)}) scale(1 ${blink})`}>
						<ellipse cx={165} cy={172} rx={13} ry={10} fill="#fff" />
						<ellipse cx={235} cy={172} rx={13} ry={10} fill="#fff" />
						<circle cx={167} cy={172} r={7} fill="#1A0E08" />
						<circle cx={237} cy={172} r={7} fill="#1A0E08" />
						<circle cx={169} cy={169} r={2.2} fill="#fff" />
						<circle cx={239} cy={169} r={2.2} fill="#fff" />
					</g>
					{/* nose */}
					<path d="M193 186 Q188 206 196 210 L206 210" fill="none" stroke={C.skinShade} strokeWidth={6} strokeLinecap="round" />
					{/* mouth */}
					{mo > 0.06 ? (
						<g>
							<ellipse cx={200} cy={232} rx={17 - mo * 3} ry={3 + mo * 11} fill={C.mouth} />
							<ellipse cx={200} cy={236 + mo * 6} rx={9} ry={2 + mo * 4} fill="#C0564A" opacity={mo > 0.3 ? 1 : 0} />
						</g>
					) : smile ? (
						<path d="M180 228 Q200 246 220 228" fill="none" stroke={C.mouth} strokeWidth={6} strokeLinecap="round" />
					) : (
						<path d="M184 232 L216 232" stroke={C.mouth} strokeWidth={6} strokeLinecap="round" />
					)}
				</g>
			</g>
		</svg>
	);
};
