// End card with both products: the real website on a laptop + the app on a phone.
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {EASE, tw, prog} from '../kit/core';
import {Backdrop, Home} from './ExcelAd';
import {StoreBadge} from './ExcelPass';

const O = '#FF822B';
const D = '#15161C';
const MUTE = '#6B6E78';

const Laptop: React.FC<{w: number; at: number}> = ({w, at}) => {
  const f = useCurrentFrame();
  const sw = w * 0.86;
  const sh = sw * 0.625;
  const scroll = tw(f, [at + 50, at + 420], [0, 1], EASE.inOut);
  const imgH = sw * (3900 / 1080);
  return (
    <div style={{width: w, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div style={{width: sw + w * 0.04, padding: w * 0.02, background: '#0E0F12', borderRadius: w * 0.03, boxShadow: '0 40px 80px rgba(40,25,10,.3)'}}>
        <div style={{width: sw, height: sh, background: '#fff', borderRadius: w * 0.008, overflow: 'hidden', position: 'relative'}}>
          <div style={{height: sh * 0.06, background: '#F1F1F3', display: 'flex', alignItems: 'center', gap: sh * 0.012, padding: `0 ${sh * 0.025}px`}}>
            {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <div key={c} style={{width: sh * 0.022, height: sh * 0.022, borderRadius: 99, background: c}} />)}
            <div style={{flex: 1, marginLeft: sh * 0.03, height: sh * 0.036, borderRadius: 99, background: '#fff', fontSize: sh * 0.022, color: MUTE, display: 'flex', alignItems: 'center', paddingLeft: sh * 0.02}}>excelacademyonline.com</div>
          </div>
          <Img src={staticFile('xa/site_full.jpg')} style={{position: 'absolute', top: sh * 0.06, left: 0, width: sw, transform: `translateY(${-scroll * (imgH - sh * 0.94) * 0.55}px)`}} />
        </div>
      </div>
      <div style={{width: w, height: w * 0.035, background: 'linear-gradient(#C9CBD1,#8E9098)', borderRadius: `0 0 ${w * 0.05}px ${w * 0.05}px`}} />
    </div>
  );
};

const Phone: React.FC<{h: number; at: number}> = ({h, at}) => {
  const k = h / 2000;
  return (
    <div style={{position: 'relative', width: 1000 * k, height: h}}>
      <div style={{position: 'absolute', left: 85 * k, top: 103 * k, width: 830 * k, height: 1794 * k, borderRadius: 120 * k, overflow: 'hidden', background: '#000'}}>
        <div style={{width: 390, height: 843, transform: `scale(${(830 * k) / 390})`, transformOrigin: '0 0'}}>
          <Home at={at + 10} />
        </div>
      </div>
      <Img src={staticFile('xa/phone_frame.png')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}} />
    </div>
  );
};

export const EndDuo: React.FC<{a: number; b: number}> = ({a, b}) => {
  // a = card start frame, b = badges frame
  const f = useCurrentFrame();
  const {width: W, height: H} = useVideoConfig();
  const u = Math.min(W, H) / 1080;
  const tall = H > W;
  const dev = prog(f, a, a + 40, EASE.out);
  const ph = prog(f, a + 14, a + 50, EASE.back);
  const lp = prog(f, a + 30, a + 70, EASE.out);
  const btn = prog(f, b, b + 30, EASE.back);
  const lw = (tall ? 860 : 900) * u;
  const devices = (
    <div style={{position: 'relative', width: lw + 120 * u, transform: `translateY(${(1 - dev) * 80 * u}px) scale(${0.9 + dev * 0.1})`, opacity: dev}}>
      <Laptop w={lw} at={a} />
      <div style={{position: 'absolute', right: 0, bottom: -40 * u, transform: `translateY(${(1 - ph) * 200 * u}px) rotate(${(1 - ph) * 12}deg)`, filter: 'drop-shadow(0 30px 40px rgba(40,25,10,.35))'}}>
        <Phone h={(tall ? 520 : 500) * u} at={a} />
      </div>
    </div>
  );
  const text = (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: lp, transform: `translateY(${(1 - lp) * 40 * u}px)`}}>
      <Img src={staticFile('xa/logo_dark.png')} style={{width: (tall ? 780 : 640) * u}} />
      <div style={{marginTop: 26 * u, fontSize: 34 * u, fontWeight: 800, color: D}}>
        Website <span style={{color: O}}>+</span> App
      </div>
      <div style={{marginTop: 8 * u, fontSize: 28 * u, fontWeight: 600, color: MUTE}}>Trusted by students worldwide</div>
      <div style={{display: 'flex', gap: 22 * u, marginTop: 34 * u, transform: `scale(${btn})`, opacity: Math.min(1, btn * 2)}}>
        <StoreBadge kind="play" u={u * 0.95} />
        <StoreBadge kind="apple" u={u * 0.95} />
      </div>
      <div style={{marginTop: 26 * u, fontSize: 34 * u, fontWeight: 700, color: O, opacity: tw(f, [b + 20, b + 40], [0, 1])}}>excelacademyonline.com</div>
    </div>
  );
  return (
    <AbsoluteFill style={{opacity: prog(f, a - 10, a + 10)}}>
      <Backdrop />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: tall ? 'column' : 'row', gap: (tall ? 90 : 60) * u}}>
        {devices}
        {text}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
