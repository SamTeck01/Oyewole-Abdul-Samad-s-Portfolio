// Separate entry for the text-technique gallery: npx remotion still src/gallery-text.ts <id> out.png --frame=N
import {registerRoot} from 'remotion';
import {TextGalleryRoot} from './gallery/TextGalleryRoot';
registerRoot(TextGalleryRoot);
