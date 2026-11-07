// Inject the server-rendered home page into dist/index.html (runs after both
// `vite build` and `vite build --ssr`). Fails the build loudly rather than
// shipping an empty page if anything goes wrong.
import { readFile, writeFile, rm } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const { render } = await import(pathToFileURL(resolve(root, 'dist-ssr/entry-server.js')).href);

const file = resolve(root, 'dist/index.html');
const html = await readFile(file, 'utf8');
const marker = '<div id="root"></div>';
if (!html.includes(marker)) throw new Error('prerender: #root placeholder not found in dist/index.html');

const app = render('/');
if (app.length < 5000) throw new Error(`prerender: rendered HTML suspiciously small (${app.length} chars)`);

await writeFile(file, html.replace(marker, `<div id="root">${app}</div>`));
await rm(resolve(root, 'dist-ssr'), { recursive: true, force: true });
console.log(`prerender: injected ${(app.length / 1024).toFixed(0)} KB of HTML into dist/index.html`);
