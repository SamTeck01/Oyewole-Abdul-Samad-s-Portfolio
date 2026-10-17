import {Composition} from 'remotion';
import {Ad, FPS} from './Ad';
import {Reel, RFPS, CUES} from './Reel';
import {Kinetic, KFPS, KCUES} from './Kinetic';
import cues from './cues.json';
import cuesEn from './cues_en.json';
const DE = Math.ceil(cuesEn.total * FPS);
const D = Math.ceil(cues.total * FPS);
export const Root = () => (
  <>
    <Composition id="BK-4x5" component={Ad} durationInFrames={D} fps={FPS} width={1080} height={1350} />
    <Composition id="BK-EN-4x5" component={Ad} durationInFrames={DE} defaultProps={{lang: 'en' as const}} fps={FPS} width={1080} height={1350} />
    <Composition id="BK-9x16" component={Ad} durationInFrames={D} fps={FPS} width={1080} height={1920} />
    <Composition id="BK-EN-9x16" component={Ad} durationInFrames={DE} defaultProps={{lang: 'en' as const}} fps={FPS} width={1080} height={1920} />
    <Composition id="BK-1x1" component={Ad} durationInFrames={D} fps={FPS} width={1080} height={1080} />
    <Composition id="BK-EN-1x1" component={Ad} durationInFrames={DE} defaultProps={{lang: 'en' as const}} fps={FPS} width={1080} height={1080} />
    <Composition id="BK-Reel-DE" component={Reel} durationInFrames={Math.ceil(CUES.de.total * RFPS)} defaultProps={{lang: 'de' as const}} fps={RFPS} width={1080} height={1920} />
    <Composition id="BK-Reel-EN" component={Reel} durationInFrames={Math.ceil(CUES.en.total * RFPS)} defaultProps={{lang: 'en' as const}} fps={RFPS} width={1080} height={1920} />
    <Composition id="BK-Kinetic-DE" component={Kinetic} durationInFrames={Math.ceil(KCUES.de.total * KFPS)} defaultProps={{lang: 'de' as const}} fps={KFPS} width={1080} height={1920} />
    <Composition id="BK-Kinetic-EN" component={Kinetic} durationInFrames={Math.ceil(KCUES.en.total * KFPS)} defaultProps={{lang: 'en' as const}} fps={KFPS} width={1080} height={1920} />
  </>
);
