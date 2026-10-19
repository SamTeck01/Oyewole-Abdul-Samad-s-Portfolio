// Local fonts (Google Fonts is blocked in the cloud). Call loadFonts() once in Root.
import {continueRender, delayRender, staticFile} from 'remotion';

const FILES: [string, string, string, string][] = [
  ['Inter', 'inter-latin-400-normal.woff2', '400', 'normal'],
  ['Inter', 'inter-latin-500-normal.woff2', '500', 'normal'],
  ['Inter', 'inter-latin-600-normal.woff2', '600', 'normal'],
  ['Inter', 'inter-latin-700-normal.woff2', '700', 'normal'],
  ['Instrument Serif', 'instrument-serif-latin-400-italic.woff2', '400', 'italic'],
];

let loaded = false;
export const loadFonts = () => {
  if (loaded || typeof document === 'undefined') return;
  loaded = true;
  const h = delayRender('fonts');
  Promise.all(
    FILES.map(([family, file, weight, style]) => {
      const ff = new FontFace(family, `url(${staticFile(`fonts/${file}`)})`, {weight, style});
      return ff.load().then((f) => (document.fonts as unknown as {add: (f: FontFace) => void}).add(f));
    }),
  ).then(() => continueRender(h));
};

export const SANS = 'Inter, system-ui, sans-serif';
export const SERIF = '"Instrument Serif", serif';
