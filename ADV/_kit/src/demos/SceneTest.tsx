import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {SiteScene} from '../kit/scenes';
import {Worker} from '../kit/character';

export const SceneTest: React.FC = () => {
  const t = useCurrentFrame() / 60;
  return (
    <AbsoluteFill>
      <SiteScene t={t} cam={t * 20} />
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        <Worker
          scale={0.62}
          p={{x: 470, y: 690, lean: 0, head: 3, lShoulder: 20, lElbow: -20, rShoulder: 15, rElbow: -15, lHip: 3, lKnee: 0, rHip: -3, rKnee: 0, blink: 0, mouth: 'C', look: 0.4}}
        />
      </svg>
    </AbsoluteFill>
  );
};
