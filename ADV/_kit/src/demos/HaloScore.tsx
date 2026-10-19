// Shot-for-shot rebuild of reference 05 (mcvisuals "Opal"), brand swapped to a fictional "halo".
// Structure = the "score-pill template" (also used by ref 06 Qwix): chart overload -> stat pills
// -> bracket to score -> app icon locks -> blocked list -> CTA sheen -> wordmark.
// One continuous camera, no hard cuts. 60 fps, 1920x1080. Times noted in reference seconds.
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {EASE, prog, tw} from '../kit/core';
import {SANS} from '../kit/fonts';
import {DarkGlow, Icon, SheenButton, StatPill, countUp, hexA} from '../kit/ui';
import {Bracket} from '../kit/shapes';

const LILAC = '#efeaff';
const CYAN = '#2ee6ff';
const BAR_H = [0.62, 0.52, 0.44, 0.6, 0.8, 0.66, 0.54];
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

// ---------------------------------------------------------------- 0.0–2.0 s: sleep chart
const Chart: React.FC<{f: number}> = ({f}) => {
  const rotX = tw(f, [0, 96], [64, 0], EASE.inOut);
  const y = tw(f, [0, 96], [300, 40], EASE.inOut);
  const s = tw(f, [0, 110], [0.8, 1.95], EASE.inOut);
  const fade = 1 - prog(f, 112, 120, EASE.in);
  const fill = tw(f, [64, 96], [0, 0.52], EASE.out) + tw(f, [96, 108], [0, 0.28], EASE.inOut);
  const hot = prog(f, 96, 106);
  const flash = prog(f, 106, 112, EASE.in);
  const chartW = 1100,
    chartH = 360,
    barW = 92,
    gap = (chartW - 7 * barW) / 6;
  return (
    <AbsoluteFill style={{perspective: 1700, opacity: fade}}>
      <div
        style={{
          position: 'absolute',
          left: 960 - 650,
          top: 540 - 380 + y,
          width: 1300,
          height: 760,
          transform: `scale(${s}) rotateX(${rotX}deg)`,
          transformOrigin: '60% 62%',
          borderRadius: 64,
          background: 'linear-gradient(180deg, #1b1a20, #121116)',
          boxShadow: '0 60px 160px rgba(0,0,0,0.6)',
          fontFamily: SANS,
          filter: `blur(${tw(f, [0, 30], [6, 0])}px)`,
        }}
      >
        <div style={{position: 'absolute', left: 90, top: 70, color: '#6c6a75', fontSize: 30, fontWeight: 500}}>
          Friday, 4 September
        </div>
        <div style={{position: 'absolute', left: 88, top: 108, color: '#8d8a96', fontSize: 92, fontWeight: 600, letterSpacing: -2}}>
          9h 15m
        </div>
        <div style={{position: 'absolute', left: 100, top: 270, width: chartW, height: chartH}}>
          {/* grid labels */}
          {[
            ['16h', 0],
            ['avg', 1 - 0.52],
            ['0', 1],
          ].map(([t, p], i) => (
            <React.Fragment key={i}>
              <div
                style={{
                  position: 'absolute',
                  left: -10,
                  right: 0,
                  top: (p as number) * chartH,
                  borderTop: i === 1 ? '3px dashed rgba(200,200,210,0.55)' : '1px solid rgba(255,255,255,0.06)',
                }}
              />
              <div style={{position: 'absolute', left: chartW + 18, top: (p as number) * chartH - 20, color: '#55535d', fontSize: 30}}>
                {t}
              </div>
            </React.Fragment>
          ))}
          {BAR_H.map((h, i) => {
            const grow = tw(f, [4 + i * 5, 34 + i * 5], [0, 1], EASE.out);
            const x = i * (barW + gap);
            const isFri = i === 4;
            return (
              <React.Fragment key={i}>
                <div
                  style={{
                    position: 'absolute',
                    left: x,
                    bottom: 0,
                    width: barW,
                    height: h * chartH * grow,
                    borderRadius: 10,
                    background: 'linear-gradient(180deg, #4a4952, #2c2b31)',
                    opacity: isFri ? 0.75 : 1,
                  }}
                />
                {isFri ? (
                  <div
                    style={{
                      position: 'absolute',
                      left: x,
                      bottom: 0,
                      width: barW,
                      height: Math.max(6, fill * chartH),
                      borderRadius: 10,
                      overflow: 'hidden',
                      boxShadow: `0 0 ${40 + flash * 120}px ${hexA(flash > 0 ? '#ffffff' : CYAN, 0.7)}`,
                      opacity: tw(f, [60, 66], [0, 1]),
                    }}
                  >
                    <div style={{position: 'absolute', inset: 0, background: CYAN}} />
                    {/* the part above the average line overheats */}
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        height: Math.max(0, fill - 0.52) * chartH,
                        background: 'linear-gradient(180deg,#ffe36a,#ff9a2e)',
                        opacity: hot,
                      }}
                    />
                    <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: flash}} />
                  </div>
                ) : null}
                <div style={{position: 'absolute', left: x, width: barW, top: chartH + 26, textAlign: 'center', color: '#4f4d57', fontSize: 30}}>
                  {DAYS[i]}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 2.0–5.2 s: stat pills -> score
const Pills: React.FC<{f: number}> = ({f}) => {
  if (f < 112 || f > 330) return null;
  // glowing dot that the overload collapses into
  const dot = prog(f, 112, 120) * (1 - prog(f, 124, 130));
  // group camera: tilt up to reveal score (ref 4.3–5.0 s)
  const groupY = tw(f, [252, 296], [0, 330], EASE.inOut);
  const groupS = 1.8 * tw(f, [190, 216], [1, 0.86], EASE.inOut) * tw(f, [252, 296], [1, 0.92], EASE.inOut);
  const out = prog(f, 304, 326, EASE.in);
  const sleepX = tw(f, [190, 216], [0, -340], EASE.inOut);
  const sleepScale = tw(f, [122, 136], [0.3, 1], EASE.back) * tw(f, [126, 172], [0.86, 1.12], EASE.out);
  const spawn = (a: number) => ({
    s: tw(f, [a, a + 14], [0.3, 1.12], EASE.back),
    o: prog(f, a, a + 6),
  });
  const p2 = spawn(206),
    p3 = spawn(220);
  // travelling light dots that give birth to pills 2 and 3
  const trav = (a: number, x0: number, x1: number) => ({
    x: tw(f, [a, a + 14], [x0, x1], EASE.inOut),
    o: prog(f, a, a + 4) * (1 - prog(f, a + 12, a + 16)),
  });
  const d2 = trav(193, -340, 0),
    d3 = trav(206, 0, 340);
  const pillAt = (x: number, s: number, o: number, node: React.ReactNode) => (
    <div style={{position: 'absolute', left: 960 + x, top: 540, transform: `translate(-50%,-50%) scale(${s})`, opacity: o}}>{node}</div>
  );
  const scoreIn = prog(f, 268, 284);
  return (
    <AbsoluteFill style={{opacity: 1 - out, filter: `blur(${out * 18}px)`}}>
      <div
        style={{
          position: 'absolute',
          left: 960,
          top: 540,
          width: 22,
          height: 22,
          marginLeft: -11,
          marginTop: -11,
          borderRadius: 11,
          background: '#fff',
          boxShadow: '0 0 40px 14px rgba(255,255,255,0.75)',
          opacity: dot,
        }}
      />
      <AbsoluteFill style={{transform: `translateY(${groupY + out * 120}px) scale(${groupS})`}}>
        {f >= 122
          ? pillAt(
              sleepX,
              sleepScale,
              1,
              <StatPill icon="moon" value={countUp(f, 126, 172, 0, 67)} label="Sleep" labelOpacity={prog(f, 132, 150)} />,
            )
          : null}
        {[d2, d3].map((d, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 960 + d.x - 9,
              top: 540 - 9,
              width: 18,
              height: 18,
              borderRadius: 9,
              background: '#fff',
              boxShadow: '0 0 30px 10px rgba(255,255,255,0.7)',
              opacity: d.o,
            }}
          />
        ))}
        {f >= 206 ? pillAt(0, p2.s, p2.o, <StatPill icon="hourglass" value={countUp(f, 208, 250, 0, 43)} label="Focus" labelOpacity={prog(f, 214, 230)} />) : null}
        {f >= 220 ? pillAt(340, p3.s, p3.o, <StatPill icon="cloud" value={countUp(f, 222, 262, 0, 31)} label="Rest" labelOpacity={prog(f, 228, 244)} />) : null}
        {/* bracket + score */}
        <div style={{position: 'absolute', left: 960 - 470, top: 350, width: 940, height: 100}}>
          <Bracket width={940} height={100} progress={prog(f, 258, 290, EASE.inOut)} color={hexA(LILAC, 0.85)} />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 110,
            textAlign: 'center',
            fontFamily: SANS,
            color: LILAC,
            opacity: scoreIn,
            transform: `translateY(${(1 - scoreIn) * 30}px)`,
          }}
        >
          <div style={{fontSize: 44, fontWeight: 500, color: '#cfcbe0'}}>Score</div>
          <div style={{display: 'inline-flex', alignItems: 'center', gap: 22, fontSize: 150, fontWeight: 600, letterSpacing: -4, fontVariantNumeric: 'tabular-nums'}}>
            {Math.round(countUp(f, 270, 300, 29, 47))}
            <Icon name="tri" size={56} color={LILAC} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 5.3–8.0 s: app icon locks, blocked list
const AppIcon: React.FC<{size: number; aberr: number}> = ({size, aberr}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.24,
      background: 'linear-gradient(145deg,#1d1c22,#0c0c10)',
      boxShadow: `${-aberr}px 0 0 rgba(37,244,238,0.85), ${aberr}px 0 0 rgba(254,44,85,0.85), 0 30px 80px rgba(0,0,0,0.6)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {/* generic social-video glyph (not a real brand) */}
    <svg width={size * 0.52} height={size * 0.52} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" fill="none" stroke="#fff" strokeWidth="2.6" />
      <path d="M10 8.3v7.4l6-3.7Z" fill="#fff" />
    </svg>
  </div>
);

const LockAndList: React.FC<{f: number}> = ({f}) => {
  if (f < 312 || f > 520) return null;
  const inn = prog(f, 312, 336);
  const drift = tw(f, [312, 430], [0.92, 1.12], EASE.inOut);
  const blurIcon = tw(f, [356, 372], [0, 16], EASE.inOut);
  const lockIn = prog(f, 362, 380, EASE.back);
  const red = prog(f, 372, 392) * (1 - prog(f, 428, 446));
  // shrink into the "Blocked Apps" list (ref 7.3 s)
  const toList = prog(f, 428, 452, EASE.inOut);
  const size = tw(f, [428, 452], [300, 150], EASE.inOut);
  const cy = tw(f, [428, 452], [540, 400], EASE.inOut);
  const listIn = prog(f, 440, 462);
  const out = prog(f, 468, 490, EASE.in);
  return (
    <AbsoluteFill style={{opacity: inn * (1 - out), transform: `translateY(${-out * 160}px) scale(1.55)`, filter: `blur(${out * 14 + (1 - inn) * 18}px)`}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(30% 40% at 50% 50%, rgba(220,30,40,${0.55 * red}), rgba(120,10,20,${0.25 * red}) 45%, transparent 75%)`,
        }}
      />
      <div style={{position: 'absolute', left: 960, top: cy, transform: `translate(-50%,-50%) scale(${toList > 0 ? 1 : drift})`}}>
        <div style={{filter: `blur(${blurIcon * (1 - toList)}px)`, opacity: 1 - toList}}>
          <AppIcon size={size} aberr={tw(f, [312, 340], [14, 5]) + Math.sin(f / 3) * 1.5} />
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: size * 0.24,
            background: `rgba(14,13,18,${0.6 * lockIn})`,
            boxShadow: toList > 0 ? `0 0 0 ${4 * toList}px rgba(230,225,245,0.85), 0 0 ${40 * toList}px rgba(230,225,245,0.5)` : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: lockIn,
          }}
        >
          <div style={{transform: `scale(${0.6 + 0.4 * lockIn})`}}>
            <Icon name="lock" size={size * 0.45} color="#f4f2f8" />
          </div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 250, textAlign: 'center', fontFamily: SANS, opacity: listIn}}>
        <div style={{color: '#e9e6f2', fontSize: 46, fontWeight: 600}}>Blocked Apps</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 492, textAlign: 'center', fontFamily: SANS, color: '#b8b4c6', fontSize: 32, fontWeight: 500, opacity: listIn}}>
        Unblock
      </div>
      <div
        style={{
          position: 'absolute',
          left: 960 - 200,
          top: 600 + (1 - listIn) * 80,
          opacity: listIn,
          fontFamily: SANS,
        }}
      >
        <div style={{color: '#e9e6f2', fontSize: 40, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6}}>
          Rules <Icon name="chevron" size={34} color="#e9e6f2" stroke={2.4} />
        </div>
        <div
          style={{
            marginTop: 26,
            width: 440,
            height: 230,
            borderRadius: 44,
            background: 'linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.03))',
            boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.08)',
            padding: 36,
            boxSizing: 'border-box',
          }}
        >
          <div style={{display: 'flex', gap: 20, alignItems: 'center', color: '#cfcbe0'}}>
            <Icon name="calendar" size={54} color="#cfcbe0" />
            <Icon name="arrow" size={40} color="#8e8a9c" />
            <Icon name="shield" size={50} color="#cfcbe0" />
          </div>
          <div style={{marginTop: 44, display: 'inline-block', padding: '8px 20px', borderRadius: 20, background: 'rgba(255,255,255,0.08)', color: '#a7a3b6', fontSize: 26, whiteSpace: 'nowrap'}}>
            Work Time Block · 8h left
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 8.3–9.0 s: CTA, 9.0 s+: wordmark
const Cta: React.FC<{f: number}> = ({f}) => {
  if (f < 492 || f > 560) return null;
  const inn = prog(f, 494, 514);
  const out = prog(f, 538, 552, EASE.in);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div
        style={{
          opacity: inn * (1 - out),
          transform: `translateY(${(1 - inn) * 120}px) scale(${1 + out * 0.15})`,
          filter: `blur(${(1 - inn) * 20 + out * 24}px)`,
        }}
      >
        <SheenButton width={1100} height={210} label="Start" icon="play" sheen={prog(f, 506, 540, EASE.inOut)} press={tw(f, [528, 532], [0, 1]) - tw(f, [532, 540], [0, 1])} />
      </div>
    </AbsoluteFill>
  );
};

const Wordmark: React.FC<{f: number}> = ({f}) => {
  if (f < 540) return null;
  const inn = prog(f, 542, 574);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          color: '#fff',
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 170,
          letterSpacing: -7,
          opacity: inn,
          filter: `blur(${(1 - inn) * 26}px)`,
          transform: `scale(${tw(f, [542, 660], [1.1, 0.98], EASE.out)})`,
          textShadow: `0 0 ${60 * (1 - inn) + 20}px rgba(220,210,255,0.35)`,
        }}
      >
        <svg width={150} height={150} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8.6" fill="none" stroke="#fff" strokeWidth="3.2" />
          <circle cx="12" cy="12" r="3.2" fill="#fff" opacity={prog(f, 560, 580)} />
        </svg>
        halo
      </div>
    </AbsoluteFill>
  );
};

export const HaloScore: React.FC = () => {
  const f = useCurrentFrame();
  // background glow follows the story: lilac, then red tint during the lock, back to lilac
  return (
    <AbsoluteFill>
      <DarkGlow glow="#9c8cf0" strength={tw(f, [0, 120], [0.12, 0.36])} y={-14} size={78} />
      <Audio src={staticFile('audio/halo.wav')} />
      <Chart f={f} />
      <Pills f={f} />
      <LockAndList f={f} />
      <Cta f={f} />
      <Wordmark f={f} />
      <AbsoluteFill style={{background: 'radial-gradient(75% 75% at 50% 50%, transparent 55%, rgba(0,0,0,0.55))', pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};
