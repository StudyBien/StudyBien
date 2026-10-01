/**
 * Records the StudyBien tour: a scripted walk through the real site with a
 * visible cursor, click ripples and captions. Writes the raw video plus the
 * click times (for pops) to /var/tmp/tour.
 */
import { chromium, type Page, type Locator } from 'playwright-core';
import { writeFileSync, readdirSync, renameSync, readFileSync } from 'node:fs';

const B = 'http://localhost:3100';
const W = 1280, H = 720;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: W, height: H }, recordVideo: { dir: '/var/tmp/tour/raw', size: { width: W, height: H } }, deviceScaleFactor: 1 });
const t0 = Date.now();
const clicks: number[] = [];
const marks: Array<[number, string]> = [];

// overlay: cursor, ripple, caption — re-injected on every page
await ctx.addInitScript({ content: readFileSync(new URL('./overlay.js', import.meta.url), 'utf8') });

const p = await ctx.newPage();
p.on('pageerror', (e) => console.log('pageerror', e.message));
process.on('unhandledRejection', async (e) => { await p.screenshot({ path: '/var/tmp/tour/fail.png' }).catch(() => {}); console.log('FAIL', String(e).slice(0, 300)); process.exit(1); });
const now = () => (Date.now() - t0) / 1000;
const wait = (ms: number) => p.waitForTimeout(ms);
async function caption(text: string, sub = '') {
  marks.push([now(), text]);
  await p.evaluate(([t, s]) => (window as any).__caption?.(s ? `${t}<small>${s}</small>` : t), [text, sub]).catch(() => {});
}
async function click(target: Locator, opts: { pause?: number } = {}) {
  await target.waitFor({ timeout: 8000 }).catch(async () => { await p.screenshot({ path: '/var/tmp/tour/fail.png' }); });
  await target.scrollIntoViewIfNeeded().catch(() => {});
  const box = await target.boundingBox();
  if (!box) { await p.screenshot({ path: '/var/tmp/tour/fail.png' }); throw new Error('no box for ' + target); }
  const x = box.x + box.width / 2, y = box.y + box.height / 2;
  await p.mouse.move(x, y, { steps: 14 });
  await wait(120);
  await p.evaluate(([a, b]) => (window as any).__ripple?.(a, b), [x, y]);
  clicks.push(now());
  await p.mouse.click(x, y);
  await wait(opts.pause ?? 450);
}
async function type(target: Locator, text: string) {
  await click(target, { pause: 150 });
  await p.keyboard.type(text, { delay: 28 });
}

// ------------------------------------------------------------------ 1. home
await p.goto(B + '/');
await wait(1100);                                 // ¡Bienvenidos! splash plays
await caption('¡Bienvenidos a StudyBien!', 'Free Spanish for teachers and students');
await wait(2200);
await p.mouse.wheel(0, 420); await wait(900);
await p.mouse.wheel(0, -420); await wait(500);

// ------------------------------------------------------------------ 2. menu → worksheets
await caption('Everything lives in the ☰ Menu');
await click(p.getByRole('button', { name: 'Menu' }), { pause: 1100 });
await click(p.locator('#site-menu').getByRole('link', { name: /Worksheets/ }), { pause: 900 });
await caption('Worksheets for every level', 'Spanish 1 to 6, AP and College');
await click(p.getByRole('tab', { name: 'Spanish 2' }), { pause: 900 });
await click(p.getByRole('link', { name: 'Answer key' }).first(), { pause: 1100 });
await caption('Each worksheet has its answer key', 'Free with a teacher account');
await wait(1300);

// ------------------------------------------------------------------ 3. quizzes + games
await click(p.getByRole('button', { name: 'Menu' }), { pause: 700 });
await click(p.locator('#site-menu').getByRole('link', { name: /Quizzes/ }), { pause: 800 });
await caption('Quizzes, tests and readings', 'Auto-graded, with explanations');
await click(p.getByRole('link', { name: /Vocabulario: Los colores/ }), { pause: 900 });
await click(p.locator('fieldset').first().locator('label').first(), { pause: 500 });
await click(p.locator('fieldset').nth(1).locator('label').nth(2), { pause: 700 });
await click(p.getByRole('button', { name: 'Menu' }), { pause: 600 });
await click(p.locator('#site-menu').getByRole('link', { name: /Games/ }), { pause: 700 });
await caption('Games: hangman and word search');
await click(p.getByRole('link', { name: /El ahorcado/ }), { pause: 800 });
for (const l of ['A', 'R', 'O']) await click(p.getByRole('button', { name: l, exact: true }), { pause: 280 });
await wait(500);

// ------------------------------------------------------------------ 4. Learn with Plumi
await click(p.getByRole('button', { name: 'Menu' }), { pause: 600 });
await click(p.locator('#site-menu').getByRole('link', { name: /Learn with Plumi/ }), { pause: 900 });
await caption('Learn with Plumi, our talking pen', 'Niveles from A1 to C2');
await wait(1000);
await click(p.getByRole('button', { name: /Escuchar/ }), { pause: 900 });
await caption('Pick the voice you like', 'Mexico or Spain · female or male');
await click(p.getByRole('option', { name: /Lucía/ }), { pause: 900 });
await click(p.locator('a[href="/learn/a1-animales/0"]'), { pause: 1000 });
await caption('Tap each picture to hear it');
for (const c of await p.locator('.grid button').all()) await click(c, { pause: 380 });
await click(p.getByRole('button', { name: 'Continuar' }), { pause: 800 });
await caption('Then find the right one', 'Plumi cheers you on: ¡Órale! ¡Qué padre!');
const txt = (await p.locator('main').textContent())!;
const target = /«(.+?)»/.exec(txt)?.[1] ?? '';
const cards = p.locator('.grid button');
for (let k = 0; k < 4; k++) if ((await cards.nth(k).textContent())!.includes(target)) { await click(cards.nth(k), { pause: 400 }); break; }
await click(p.getByRole('button', { name: 'Comprobar' }), { pause: 1500 });

// finish-a-nivel moment: mark the lesson done and show the ink splash on the path
await p.evaluate(() => {
  const k = 'studybien.plumi.v1';
  localStorage.setItem(k, JSON.stringify({ lessons: { 'a1-animales:0': 3 }, xp: 25, streak: 1, lastDay: new Date().toLocaleDateString('en-CA') }));
  sessionStorage.setItem('studybien.plumi.burst', 'a1-animales:0');
});
await p.goto(B + '/learn');
await caption('¡Nivel completado! 🎉', 'Finish a nivel and it splashes ink');
await wait(2000);

// ------------------------------------------------------------------ 5. teacher
await caption('Teachers: create a free classroom');
await click(p.getByRole('link', { name: 'Sign up / Sign in' }), { pause: 800 });
await click(p.getByRole('tab', { name: 'Sign up' }), { pause: 500 });
await type(p.getByLabel('Your name'), 'Sra. García');
await type(p.getByLabel('Email'), `profe${Date.now()}@example.com`);
await type(p.getByLabel('Password'), 'unaclave1234');
await click(p.getByRole('button', { name: 'Create account' }), { pause: 1300 });
await type(p.getByLabel('Course name'), 'Español 2 · Período 3');
await p.getByLabel('Level').selectOption('spanish-2');
await click(p.getByRole('button', { name: '+ Create course' }), { pause: 1500 });
await caption('Share the join code with your class', 'Plus announcements, assignments, grades and people');
const code = (await p.locator('p.font-mono.text-4xl').textContent())!.trim();
await wait(1600);
await click(p.getByRole('link', { name: 'Assignments' }).first(), { pause: 1000 });
await click(p.getByRole('link', { name: 'Calendar' }), { pause: 1200 });

// ------------------------------------------------------------------ 6. student
await ctx.clearCookies();
await p.goto(B + '/');
await caption('Students: join with the code');
await wait(600);
await click(p.getByRole('link', { name: 'Join classroom as a student' }), { pause: 700 });
await type(p.getByLabel('Class code'), code);
await click(p.getByRole('button', { name: 'Continue' }), { pause: 1000 });
await type(p.getByLabel('First name'), 'Lucía');
await type(p.getByLabel('Last initial'), 'M');
await type(p.getByLabel('Make a PIN'), '2468');
await type(p.getByLabel('Type it again'), '2468');
await click(p.getByRole('button', { name: 'Join the class' }), { pause: 1400 });
await caption('Their own portal: assignments, grades and more');
await wait(1600);

// ------------------------------------------------------------------ end card
await p.goto(B + '/');
await caption('StudyBien · ¡Vamos a aprender!', 'studybien — free for every teacher');
await wait(2800);

const total = now();
await p.close(); await ctx.close(); await browser.close();
const f = readdirSync('/var/tmp/tour/raw').filter((x) => x.endsWith('.webm'))[0];
renameSync(`/var/tmp/tour/raw/${f}`, '/var/tmp/tour/raw.webm');
writeFileSync('/var/tmp/tour/timeline.json', JSON.stringify({ total, clicks, marks }, null, 1));
console.log('recorded', total.toFixed(1), 's,', clicks.length, 'clicks');
