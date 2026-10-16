import {Composition} from 'remotion';
import {Ad, FPS, TOTAL} from './Ad';
export const Root = () => (
  <>
    <Composition id="LeahLuxe-9x16" component={Ad} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
  </>
);
