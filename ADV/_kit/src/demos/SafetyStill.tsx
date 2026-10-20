import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {Site} from './CharTest';

export const SafetyStill: React.FC<{pose: number}> = ({pose}) => {
  const t = useCurrentFrame() / 60;
  return (
    <AbsoluteFill>
      <Site t={t} />
      <div style={{position: 'absolute', left: 520, bottom: 120, transform: 'translateX(-50%)'}}>
        <div style={{position: 'absolute', left: '10%', right: '10%', bottom: -14, height: 30, borderRadius: '50%', background: 'rgba(60,30,10,0.2)', filter: 'blur(6px)'}} />
        <Img src={staticFile(`tunde/pose${pose}.png`)} style={{height: 720, display: 'block'}} />
      </div>
    </AbsoluteFill>
  );
};
