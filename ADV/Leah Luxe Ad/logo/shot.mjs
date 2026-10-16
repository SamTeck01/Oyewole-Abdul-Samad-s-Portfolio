import {chromium} from '/opt/node-tools/node_modules/playwright/index.mjs';
const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1000,height:1000}});
await p.goto('file://' + process.cwd() + '/logos.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(800);
for (let i = 1; i <= 5; i++) await (await p.$('#l' + i)).screenshot({path: `LeahLuxe_logo_${i}.png`});
await b.close();
