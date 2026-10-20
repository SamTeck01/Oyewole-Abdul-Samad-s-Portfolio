// Contact sheet of downloaded Lottie files (public/lottie/<prefix><n>.json) to pick assets.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender, staticFile} from 'remotion';
import {Lottie, LottieAnimationData} from '@remotion/lottie';

export const LottieGrid: React.FC<{prefix: string; count: number; only?: number[]}> = ({prefix, count, only}) => {
  const [data, setData] = useState<(LottieAnimationData | null)[] | null>(null);
  const [h] = useState(() => delayRender('lottie'));
  useEffect(() => {
    Promise.all(
      (only ?? Array.from({length: count}, (_, i) => i + 1)).map((n) =>
        fetch(staticFile(`lottie/${prefix}${n}.json`)).then((r) => r.json()).catch(() => null),
      ),
    ).then((d) => {
      setData(d);
      continueRender(h);
    });
  }, [count, h, prefix]);
  return (
    <AbsoluteFill style={{background: '#f4f1ec', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, padding: 8}}>
      {data?.map((d, i) => (
        <div key={i} style={{position: 'relative', background: '#fff', overflow: 'hidden'}}>
          {d ? <Lottie animationData={d} style={{width: '100%', height: '100%'}} /> : null}
          <div style={{position: 'absolute', left: 10, top: 6, font: '700 40px sans-serif', color: '#e5243b'}}>{i + 1}</div>
        </div>
      ))}
    </AbsoluteFill>
  );
};
