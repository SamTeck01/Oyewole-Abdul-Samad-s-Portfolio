import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Site} from './CharTest';
import {Puppet, PuppetPose, REST} from '../kit/puppet';

const P: Partial<PuppetPose>[] = [
  {uaR: -70, faR: -60, hR: 10, uaL: 20, faL: 30},
  {uaR: -95, faR: -5, hR: 0},
  {uaL: 165, faL: 95, hL: 30},
  {uaL: 35, faL: 95, hL: 20},
  {uaR: -40, faR: -110, hR: -20},
  {uaL: 40, faL: 70, uaR: -40, faR: -70},
];
export const PuppetTest: React.FC = () => (
  <AbsoluteFill>
    <Site t={0} />
    {P.map((p, i) => (
      <div key={i} style={{position: 'absolute', left: 160 + i * 320, top: 620}}>
        <Puppet scale={0.5} p={{...REST, ...p}} />
      </div>
    ))}
  </AbsoluteFill>
);
