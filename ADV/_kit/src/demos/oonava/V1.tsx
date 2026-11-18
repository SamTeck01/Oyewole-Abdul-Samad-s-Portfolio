// Oonava V1 "Your business, running itself". Times are absolute seconds (VO starts at 0.3 s).
import React from 'react';
import {AbsoluteFill, Audio, Img, staticFile, useCurrentFrame} from 'remotion';
import {EASE, tw, prog} from '../../kit/core';
import {Kinetic} from '../kinetic';
import {C, SANS, SERIF, useU, rise, Head, Card, Toast, Chip, Ico, Captions, EndCard, W} from './kit';
import words from './v1_words.json';

const s = (x: number) => Math.round(x * 60);
export const OV1_DURATION = s(44);
const VO = 0.3;
// punch-ins: scene changes + key beats only
export const CUTS = [0.3, 3.65, 5.12, 7.4, 10.3, 12.2, 13.3, 14.3, 16.35, 17.05, 18.3, 21.65, 24.9, 27.85, 29.2, 30.38, 31.4, 32.95, 34.4];

const Bg: React.FC<{c: string; children?: React.ReactNode}> = ({c, children}) => (
  <AbsoluteFill style={{background: c}}>{children}</AbsoluteFill>
);
const Glow: React.FC = () => (
  <AbsoluteFill style={{background: 'radial-gradient(60% 40% at 50% 35%, rgba(38,160,248,.14), transparent 70%)'}} />
);

/* ---------- 1. Hook ---------- */
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const {u, tall} = useU();
  const buzz = f > s(0.35) && f < s(0.95) ? Math.sin(f * 2.2) * 7 * (1 - (f - s(0.35)) / s(0.6)) : 0;
  const t1 = f < s(5.05);
  return (
    <Bg c={C.ink}>
      <Glow />
      <AbsoluteFill style={{alignItems: 'center', ...(tall ? {} : {flexDirection: 'row', justifyContent: 'center', gap: 120}), transform: `scale(${u}) translateY(${tw(f, [0, s(7.5)], [0, -30])}px)`, transformOrigin: tall ? '50% 0' : '50% 50%'}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{marginTop: tall ? 380 : 0, fontFamily: SANS, color: '#fff', textAlign: 'center', ...rise(f, 0, 30)}}>
          <div style={{fontSize: 40, fontWeight: 500, color: '#9EA3AE'}}>Sunday 22 November</div>
          <div style={{fontSize: 250, fontWeight: 300, letterSpacing: '-0.05em', lineHeight: 1}}>21:47</div>
        </div>
        <div style={{marginTop: 70, transform: `translateX(${buzz}px) translateY(${(1 - prog(f, s(0.15), s(0.5), EASE.back)) * -160}px) scale(${0.9 + prog(f, s(0.15), s(0.5)) * 0.1})`, opacity: prog(f, s(0.15), s(0.35))}}>
          <Toast w={tall ? 940 : 820} app="Website enquiry" title="New enquiry · 21:47, Sunday" body="Hi, is it still available? Can I view this week?" />
        </div>
        </div>
        <div style={{marginTop: tall ? 210 : 0, width: tall ? 960 : 820}}>
          {t1 ? (
            <Head words={["Who's", 'replying', 'to', 'this?']} at={s(3.65)} size={104} />
          ) : (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
              <div style={{transform: `scale(${tw(f, [s(5.15), s(5.35)], [1.25, 1], EASE.out)})`}}>
                <Head words={['Nobody.']} at={s(5.12)} size={190} weight={700} />
              </div>
              <Head words={['Until', 'Monday.']} at={s(6.4)} size={92} color={C.red} weight={600} />
            </div>
          )}
        </div>
      </AbsoluteFill>
    </Bg>
  );
};

/* ---------- 2. Problem montage ---------- */
const ROWS = ['Viewing request: Elm Road', 'Re: re: callback?', 'Is this still available?', 'Quote request', 'Following up again', 'Booking for Thursday', 'Any update on my enquiry?', 'Price question'];
const Inbox: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const n = Math.round(tw(f, [at, at + s(2.8)], [12, 47], EASE.count));
  return (
    <Card w={940} h={1144} url="mail · Inbox" dark>
      <div style={{padding: '34px 38px 0', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between'}}>
        <div style={{fontSize: 64, fontWeight: 700, color: '#fff', letterSpacing: '-0.03em'}}>Inbox</div>
        <div style={{fontSize: 44, fontWeight: 700, color: '#fff', background: C.red, borderRadius: 99, padding: '6px 26px'}}>{n} unread</div>
      </div>
      <div style={{padding: '24px 22px', display: 'flex', flexDirection: 'column', gap: 12}}>
        {ROWS.map((r, i) => {
          const p = prog(f, at + i * 9, at + i * 9 + 16);
          return (
            <div key={i} style={{display: 'flex', gap: 20, alignItems: 'center', padding: '20px 18px', borderRadius: 18, background: 'rgba(255,255,255,.04)', opacity: p, transform: `translateY(${(1 - p) * -40}px)`}}>
              <div style={{width: 16, height: 16, borderRadius: 9, background: C.blue}} />
              <div style={{flex: 1}}>
                <div style={{fontSize: 30, fontWeight: 650, color: '#fff'}}>{r}</div>
                <div style={{fontSize: 24, color: '#7E838E', marginTop: 4}}>Unread · {['21:47', '19:02', '18:40', 'Sat', 'Sat', 'Fri', 'Fri', 'Thu'][i]}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
const Tile: React.FC<{children: React.ReactNode; title: string}> = ({children, title}) => (
  <div style={{width: 460, height: 560, borderRadius: 28, background: C.card, border: '1.5px solid rgba(255,255,255,.08)', overflow: 'hidden', fontFamily: SANS, padding: 28, boxSizing: 'border-box'}}>
    <div style={{fontSize: 26, fontWeight: 600, color: '#7E838E', marginBottom: 22}}>{title}</div>
    {children}
  </div>
);
const Sticky: React.FC = () => (
  <Tile title="Desk">
    {[['Call back Tom??', '#FFE27A', -6, 0, 0], ['Follow up Fri!!', '#FFB4A2', 5, 150, 40], ['Send quote (who?)', '#B9F3C9', -3, 40, 250]].map(([t, c, r, x, y], i) => (
      <div key={i} style={{position: 'absolute', marginLeft: x as number, marginTop: y as number, width: 230, height: 190, background: c as string, transform: `rotate(${r}deg)`, borderRadius: 6, padding: 20, boxSizing: 'border-box',
        fontFamily: '"Caveat", cursive', fontSize: 40, color: '#333', boxShadow: '0 10px 20px rgba(0,0,0,.35)'}}>{t}</div>
    ))}
  </Tile>
);
const Sheet: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Tile title="leads_FINAL_v3.xlsx">
      {Array.from({length: 9}).map((_, r) => (
        <div key={r} style={{display: 'flex', gap: 6, marginBottom: 6}}>
          {[0, 1, 2].map((c) => {
            const bad = (r * 3 + c) % 4 === 1;
            const on = prog(f, s(13.4) + r * 3, s(13.4) + r * 3 + 8);
            return <div key={c} style={{flex: c === 0 ? 1.6 : 1, height: 40, borderRadius: 5, background: bad ? `rgba(200,50,47,${0.15 + on * 0.6})` : 'rgba(255,255,255,.06)', border: bad ? `1px solid rgba(200,50,47,${on})` : 'none'}} />;
          })}
        </div>
      ))}
    </Tile>
  );
};
const Clash: React.FC = () => (
  <Tile title="Calendar · Mon">
    {['09:00', '10:00', '11:00', '12:00'].map((h, i) => (
      <div key={h} style={{display: 'flex', gap: 14, height: 100, borderTop: '1px solid rgba(255,255,255,.07)', fontSize: 22, color: '#6B7075'}}>{h}</div>
    ))}
    <div style={{position: 'absolute', marginTop: -330, marginLeft: 80, width: 300, height: 150, borderRadius: 14, background: 'rgba(38,160,248,.25)', borderLeft: `6px solid ${C.blue}`, color: '#fff', fontSize: 26, fontWeight: 600, padding: 14, boxSizing: 'border-box'}}>Viewing · Elm Rd</div>
    <div style={{position: 'absolute', marginTop: -260, marginLeft: 130, width: 300, height: 150, borderRadius: 14, background: 'rgba(200,50,47,.3)', borderLeft: `6px solid ${C.red}`, color: '#fff', fontSize: 26, fontWeight: 600, padding: 14, boxSizing: 'border-box'}}>Client call ⚠</div>
  </Tile>
);

const Problem: React.FC = () => {
  const f = useCurrentFrame();
  const {u, W, H, tall} = useU();
  const m = prog(f, s(10.3), s(10.9), EASE.inOut); // inbox -> tile
  const freeze = prog(f, s(15.55), s(15.85));
  const pos = tall ? [[-245, -300], [245, -300], [-245, 300], [245, 300]] : [[-735, -40], [-245, -40], [245, -40], [735, -40]];
  const appear = [0, s(12.2), s(13.3), s(14.3)];
  const push = tw(f, [s(10.9), s(15.6)], [1, 1.06], EASE.inOut);
  return (
    <Bg c={C.ink}>
      <AbsoluteFill style={{filter: `grayscale(${freeze}) brightness(${1 - freeze * 0.35})`, transform: `scale(${push})`}}>
        <div style={{position: 'absolute', left: W / 2, top: H / 2, transform: `scale(${u * (tall ? 1 : 0.86)})`}}>
          <div style={{position: 'absolute', transform: `translate(-50%,-50%) translate(${pos[0][0] * m}px, ${pos[0][1] * m}px) scale(${1 - m * 0.511})`, opacity: prog(f, s(7.4), s(7.8))}}>
            <Inbox at={s(7.5)} />
          </div>
          {[<Sticky key="a" />, <Sheet key="b" />, <Clash key="c" />].map((el, i) => {
            const p = prog(f, appear[i + 1], appear[i + 1] + 16, EASE.back);
            return (
              <div key={i} style={{position: 'absolute', transform: `translate(-50%,-50%) translate(${pos[i + 1][0]}px, ${pos[i + 1][1]}px) scale(${0.85 + p * 0.15})`, opacity: Math.min(1, p * 1.5)}}>{el}</div>
            );
          })}
        </div>
      </AbsoluteFill>
    </Bg>
  );
};

/* ---------- 3. Turn: the dot cleans the screen ---------- */
const Turn: React.FC = () => {
  const f = useCurrentFrame();
  const {u, W, H} = useU();
  const drop = prog(f, s(15.85), s(16.2), EASE.in);
  const land = prog(f, s(16.2), s(16.35), EASE.back);
  const grow = prog(f, s(16.35), s(16.85), EASE.inOut);
  const r = 26 * u + grow * Math.hypot(W, H);
  const y = tw(drop, [0, 1], [-60 * u, H / 2]);
  const squash = f > s(16.2) && f < s(16.35) ? 1 + (1 - land) * 0.3 : 1;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: W / 2 - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: grow > 0.6 ? C.white : C.blue,
        transform: `scale(${squash}, ${2 - squash})`}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: prog(f, s(16.5), s(16.6))}}>
        <div style={{width: 980 * u}}>
          <Head words={['What', 'if', 'it', 'just…']} at={s(16.45)} size={118 * u} color={C.ink} stagger={5} />
          <div style={{height: 10 * u}} />
          <div style={{transform: `scale(${tw(f, [s(17.05), s(17.3)], [1.3, 1])})`}}>
            <Head words={['ran?']} accent={['ran?']} at={s(17.05)} size={210 * u} color={C.ink} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- 4. Show: Automate / Integrate / Build ---------- */
const Label: React.FC<{n: string; t: string; at: number; end: number}> = ({n, t, at, end}) => {
  const f = useCurrentFrame();
  const {u, tall} = useU();
  const p = prog(f, at, at + 18);
  const o = 1 - prog(f, end - 8, end);
  return (
    <div style={{position: 'absolute', ...(tall ? {top: 210 * u, left: 0, right: 0} : {top: 0, bottom: 0, left: 130 * u, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start'}), display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 22 * u, fontFamily: SANS, opacity: p * o, transform: `translateY(${(1 - p) * 40 * u}px)`}}>
      <span style={{fontSize: 34 * u, fontWeight: 600, color: C.mute}}>{n}</span>
      <span style={{fontSize: 130 * u, fontWeight: 700, letterSpacing: '-0.045em', color: C.ink}}>{t}<span style={{color: C.blue}}>.</span></span>
    </div>
  );
};

const REPLY = 'Hi James, yes it is. Would Tuesday 14:00 or Wednesday 17:30 suit for a viewing?';
const Automate: React.FC = () => {
  const f = useCurrentFrame();
  const typed = Math.round(tw(f, [s(19.2), s(20.7)], [0, REPLY.length], (x) => x));
  const sent = prog(f, s(20.8), s(21.1), EASE.back);
  return (
    <Card w={940} url="app.oonava.com/inbox" style={rise(f, s(18.35), 60, 26)}>
      <div style={{padding: 38, display: 'flex', flexDirection: 'column', gap: 26, minHeight: 760}}>
        <div style={{display: 'flex', gap: 18, alignItems: 'center', ...rise(f, s(18.6))}}>
          <div style={{width: 74, height: 74, borderRadius: 40, background: C.g2, display: 'grid', placeItems: 'center', fontSize: 30, fontWeight: 700, color: C.mute}}>JC</div>
          <div><div style={{fontSize: 32, fontWeight: 650, color: C.ink}}>James Carter</div><div style={{fontSize: 24, color: C.mute}}>Website · Sunday 21:47</div></div>
        </div>
        <div style={{alignSelf: 'flex-start', maxWidth: 700, background: C.g1, borderRadius: '8px 30px 30px 30px', padding: '24px 30px', fontSize: 32, color: C.ink, lineHeight: 1.35, ...rise(f, s(18.75))}}>
          Hi, is the 3-bed on Elm Road still available? Could I view it this week?
        </div>
        <div style={{alignSelf: 'flex-end', maxWidth: 720, minHeight: 90, background: C.blue, color: '#fff', borderRadius: '30px 8px 30px 30px', padding: '24px 30px', fontSize: 32, lineHeight: 1.35, opacity: prog(f, s(19.0), s(19.2))}}>
          {REPLY.slice(0, typed)}<span style={{opacity: typed < REPLY.length && f % 30 < 15 ? 1 : 0}}>|</span>
        </div>
        <div style={{alignSelf: 'flex-end', display: 'flex', gap: 14, transform: `scale(${sent})`, transformOrigin: '100% 50%'}}>
          <Chip text="Personalised" tone="blue" icon="bolt" />
          <Chip text="Sent" icon="check" />
        </div>
      </div>
    </Card>
  );
};

const NODES = [{n: 'crm', t: 'CRM', x: -300, y: -300}, {n: 'cal', t: 'Calendar', x: 300, y: -300}, {n: 'mail', t: 'Email', x: -300, y: 300}, {n: 'chat', t: 'WhatsApp', x: 300, y: 300}];
const Integrate: React.FC = () => {
  const f = useCurrentFrame();
  const at = s(21.75);
  return (
    <div style={{position: 'relative', width: 0, height: 0}}>
      <svg style={{position: 'absolute', left: -500, top: -500, overflow: 'visible'}} width={1000} height={1000}>
        {NODES.map((nd, i) => {
          const d = prog(f, at + 10 + i * 7, at + 34 + i * 7, EASE.inOut);
          const L = Math.hypot(nd.x, nd.y);
          return <line key={i} x1={500} y1={500} x2={500 + nd.x} y2={500 + nd.y} stroke={C.blue} strokeWidth={5} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - d)} />;
        })}
        {NODES.map((nd, i) => {
          if (f < at + 40) return null;
          return [0, 0.5].map((ph) => {
            const t = (((f - at - 40) / 55 + ph + i * 0.23) % 1);
            const out = i % 2 === 0;
            const k = out ? t : 1 - t;
            return <circle key={`${i}${ph}`} cx={500 + nd.x * k} cy={500 + nd.y * k} r={11} fill={C.blue} opacity={Math.sin(t * Math.PI)} />;
          });
        })}
      </svg>
      {NODES.map((nd, i) => {
        const p = prog(f, at + 4 + i * 6, at + 24 + i * 6, EASE.back);
        const lit = prog(f, at + 34 + i * 7, at + 44 + i * 7);
        return (
          <div key={i} style={{position: 'absolute', left: nd.x - 95, top: nd.y - 95, width: 190, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, transform: `scale(${p})`, opacity: Math.min(1, p * 2)}}>
            <div style={{width: 190, height: 190, borderRadius: 46, background: C.white, border: `2px solid ${lit > 0.5 ? C.blue : C.g2}`, display: 'grid', placeItems: 'center', boxShadow: `0 24px 50px rgba(11,40,80,${0.1 + lit * 0.08})`}}>
              <Ico n={nd.n} s={92} c={lit > 0.5 ? C.blue : C.ink} />
            </div>
            <div style={{fontFamily: SANS, fontSize: 34, fontWeight: 600, color: C.ink}}>{nd.t}</div>
          </div>
        );
      })}
      <Img src={staticFile('oon/icon512.png')} style={{position: 'absolute', left: -120, top: -120, width: 240, borderRadius: 60, transform: `scale(${prog(f, at, at + 20, EASE.back)})`, boxShadow: '0 30px 60px rgba(38,160,248,.3)'}} />
    </div>
  );
};

const Build: React.FC = () => {
  const f = useCurrentFrame();
  const at = s(24.95);
  const blk = (i: number) => {
    const p = prog(f, at + i * 12, at + i * 12 + 22, EASE.back);
    return {opacity: Math.min(1, p * 2), transform: `translateY(${(1 - p) * 60}px) scale(${0.9 + p * 0.1})`};
  };
  const chart = prog(f, at + 30, at + 90, EASE.inOut);
  const pts = [0, 30, 22, 50, 44, 70, 64, 92].map((v, i) => `${i * 110},${260 - v * 2.4}`).join(' ');
  return (
    <div style={{width: 940, fontFamily: SANS, display: 'flex', flexDirection: 'column', gap: 22}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', ...blk(0)}}>
        <div style={{fontSize: 52, fontWeight: 700, letterSpacing: '-0.03em', color: C.ink}}>Your dashboard</div>
        <Chip text="Live" icon="check" />
      </div>
      <div style={{display: 'flex', gap: 22}}>
        {[['New leads', C.blue], ['Replied', C.green], ['Booked', C.deep]].map(([t, c], i) => (
          <div key={t} style={{flex: 1, height: 230, borderRadius: 26, background: C.white, border: `1.5px solid ${C.g2}`, padding: 26, boxSizing: 'border-box', ...blk(1 + i)}}>
            <div style={{fontSize: 28, fontWeight: 600, color: C.mute}}>{t}</div>
            <div style={{display: 'flex', alignItems: 'flex-end', gap: 10, height: 110, marginTop: 34}}>
              {[0.4, 0.6, 0.5, 0.8, 0.7, 1].map((h, j) => (
                <div key={j} style={{flex: 1, borderRadius: 6, background: c, opacity: 0.35 + j * 0.13, height: `${h * 100 * prog(f, at + 24 + i * 12 + j * 3, at + 44 + i * 12 + j * 3)}%`}} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{height: 380, borderRadius: 26, background: C.white, border: `1.5px solid ${C.g2}`, padding: 28, boxSizing: 'border-box', ...blk(4)}}>
        <div style={{fontSize: 28, fontWeight: 600, color: C.mute}}>Pipeline this month</div>
        <svg width={880} height={290} style={{marginTop: 4}}>
          <polyline points={pts} fill="none" stroke={C.blue} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - chart} />
        </svg>
      </div>
      <div style={{display: 'flex', gap: 14, ...blk(5)}}>
        <Chip text="CRM synced" icon="check" size={28} />
        <Chip text="Follow-ups scheduled" tone="blue" icon="bolt" size={28} />
      </div>
    </div>
  );
};

export const Show: React.FC = () => {
  const f = useCurrentFrame();
  const {u, W, H, tall} = useU();
  const part = f < s(21.65) ? 0 : f < s(24.9) ? 1 : 2;
  const swap = (a: number, b: number) => ({opacity: prog(f, a, a + 12) * (1 - prog(f, b - 10, b))});
  return (
    <Bg c={C.white}>
      <Label n="01" t="Automate" at={s(18.3)} end={s(21.65)} />
      <Label n="02" t="Integrate" at={s(21.65)} end={s(24.9)} />
      <Label n="03" t="Build" at={s(24.9)} end={s(27.85)} />
      <div style={{position: 'absolute', left: tall ? W / 2 : W * 0.66, top: tall ? H / 2 + 90 * u : H / 2 - 30 * u, transform: `scale(${u * (tall ? 1 : 0.86)})`}}>
        {part === 0 && <div style={{position: 'absolute', transform: 'translate(-50%,-50%)', ...swap(s(18.3), s(21.65))}}><Automate /></div>}
        {part === 1 && <div style={{position: 'absolute', ...swap(s(21.65), s(24.9))}}><Integrate /></div>}
        {part === 2 && <div style={{position: 'absolute', transform: 'translate(-50%,-50%)', ...swap(s(24.9), s(27.85))}}><Build /></div>}
      </div>
    </Bg>
  );
};

/* ---------- 5. Outcome ---------- */
const Outcome: React.FC = () => {
  const f = useCurrentFrame();
  const {u} = useU();
  const lines = [['Faster', 'replies.', 27.88], ['No', 'lost', 'leads.', 29.2], ['Less', 'admin.', 30.38]] as (string | number)[][];
  const away = prog(f, s(31.25), s(31.55), EASE.in);
  const strike = prog(f, s(32.2), s(32.55), EASE.inOut);
  return (
    <Bg c={C.white}>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 30 * u, opacity: 1 - away, transform: `translateY(${-away * 120 * u}px)`}}>
          {lines.map((l) => {
            const at = s(l[l.length - 1] as number);
            return (
              <div key={at} style={{display: 'flex', alignItems: 'center', gap: 30 * u}}>
                <div style={{width: 30 * u, height: 30 * u, borderRadius: 99, background: C.blue, transform: `scale(${prog(f, at, at + 14, EASE.back)})`}} />
                <Head words={l.slice(0, -1) as string[]} at={at} size={124 * u} color={C.ink} align="left" weight={650} />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      {f > s(31.3) && (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 20 * u}}>
          <div style={{position: 'relative'}}>
            <Head words={['Stop', 'chasing.']} at={s(31.4)} size={120 * u} color={C.mute} weight={600} />
            <div style={{position: 'absolute', left: 0, top: '54%', height: 10 * u, borderRadius: 9, width: `${strike * 100}%`, background: C.red}} />
          </div>
          <div style={{transform: `scale(${tw(f, [s(33.05), s(33.35)], [1.2, 1])})`}}>
            <Head words={['Start', 'closing.']} accent={['closing.']} at={s(32.95)} size={150 * u} color={C.ink} weight={700} />
          </div>
        </AbsoluteFill>
      )}
    </Bg>
  );
};

export const OonavaV1: React.FC<{mute?: boolean}> = ({mute}) => {
  const f = useCurrentFrame();
  const {u, H} = useU();
  return (
    <AbsoluteFill style={{background: f > s(16.7) ? C.white : C.ink}}>
      <Kinetic cuts={CUTS}>
      {f < s(7.6) && <Hook />}
      {f >= s(7.3) && f < s(16.9) && <AbsoluteFill style={{opacity: prog(f, s(7.3), s(7.55))}}><Problem /></AbsoluteFill>}
      {f >= s(15.85) && f < s(18.45) && <Turn />}
      {f >= s(18.2) && f < s(27.95) && <AbsoluteFill style={{opacity: prog(f, s(18.2), s(18.35))}}><Show /></AbsoluteFill>}
      {f >= s(27.8) && f < s(34.6) && <Outcome />}
      {f >= s(34.3) && <EndCard at={s(34.4)} />}
      </Kinetic>
      <Captions words={words as W[]} offset={VO} dark={f < s(16.5)} y={H - (H > 1500 ? 330 : 120) * u} size={50 * u}
        hide={[[0, 7.45], [15.6, 18.3], [27.75, 99]]} />
      {!mute && <Audio src={staticFile('oon/v1_mix.wav')} />}
    </AbsoluteFill>
  );
};
