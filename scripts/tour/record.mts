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
  const html = sub ? `${text}<small>${sub}</small>` : text;
  // a navigation in flight can swallow the update, so settle and retry
  for (let attempt = 0; attempt < 4; attempt++) {
    await p.waitForLoadState('domcontentloaded').catch(() => {});
    const ok = await p.evaluate((h) => { const w = window as unknown as { __caption?: (x: string) => void }; if (!w.__caption) return false; w.__caption(h); return true; }, html).catch(() => false);
    if (ok) {
      await wait(250);
      const shown = await p.evaluate((h) => sessionStorage.getItem('__cap') === h, html).catch(() => false);
      if (shown) return;
    }
    await wait(250);
  }
}
async function click(target: Locator, opts: { pause?: number } = {}) {
  await target.waitFor({ timeout: 8000 }).catch(async () => { await p.screenshot({ path: '/var/tmp/tour/fail.png' }); });
  await target.scrollIntoViewIfNeeded().catch(() => {});
  const box = await target.boundingBox();
  if (!box) { await p.screenshot({ path: '/var/tmp/tour/fail.png' }); throw new Error('no box for ' + target); }
  const x = box.x + box.width / 2, y = box.y + box.height / 2;
  await p.mouse.move(x, y, { steps: 22 });
  await wait(120);
  await p.evaluate(([a, b]) => (window as any).__ripple?.(a, b), [x, y]);
  clicks.push(now());
  await p.mouse.click(x, y);
  await wait(opts.pause ?? 450);
}
/** Smooth scroll the page by dy pixels over ~ms, so the video glides instead of jumping. */
async function glide(dy: number, ms = 1400) {
  // plain-text script: the TS runner would otherwise inject helpers the page doesn't have
  await p.evaluate(`new Promise((done) => {
    const start = window.scrollY, t0 = performance.now(), d = ${dy}, t = ${ms};
    const step = (now) => {
      const k = Math.min(1, (now - t0) / t);
      const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      window.scrollTo(0, start + d * e);
      if (k < 1) requestAnimationFrame(step); else done();
    };
    requestAnimationFrame(step);
  })`);
}
async function toTop() { await p.evaluate(() => window.scrollTo({ top: 0 })); }
async function menu(name: RegExp, pause = 900) {
  await click(p.getByRole('button', { name: 'Menu' }), { pause: 650 });
  await click(p.locator('#site-menu').getByRole('link', { name }), { pause });
}
async function type(target: Locator, text: string) {
  await click(target, { pause: 150 });
  await p.keyboard.type(text, { delay: 28 });
}

// ------------------------------------------------------------------ 1. home: what's offered
await p.goto(B + '/');
await wait(1000);                                         // ¡Bienvenidos! splash
await caption('¡Bienvenidos a StudyBien!', 'Free Spanish for teachers and students');
await wait(2200);
await glide(560, 1300);                                   // past the hero and tour video
await glide(620, 1500);
await caption('A full Spanish library', 'Worksheets · quizzes · tests · readings · games');
await wait(1600);
await glide(560, 1500);
await caption('For every level', 'Spanish 1–6, AP and College');
await wait(1600);
await glide(520, 1400);
await caption('A classroom for teachers and students');
await wait(1600);
await toTop(); await wait(400);

// ------------------------------------------------------------------ 2. the menu, one example per tab
await caption('Open the ☰ Menu to explore');
await menu(/Worksheets/);
await caption('Worksheets', 'Printable, for every level');
await click(p.getByRole('link', { name: /Vocabulario: Los colores/ }).first(), { pause: 900 });
await glide(300, 900); await wait(400);
await click(p.getByRole('tab', { name: 'Answer key' }), { pause: 900 });
await caption('Every worksheet has its answer key', 'Free with a teacher account');
await wait(1300);

await menu(/Quizzes/);
await caption('Quizzes', 'Graded instantly, with explanations');
await click(p.getByRole('link', { name: /Vocabulario: Los colores/ }), { pause: 900 });
for (let k = 0; k < 3; k++) await click(p.locator('fieldset').nth(k).locator('label').first(), { pause: 260 });
await wait(500);

await menu(/Tests/);
await caption('Tests', 'Unit exams and finals with reading and writing');
await click(p.locator('main a[href^="/resources/tests/"]').first(), { pause: 900 });
await glide(900, 1600); await wait(600);

await menu(/Reading Comprehension/);
await caption('Reading Comprehension', 'Original stories, questions and writing');
await click(p.locator('main a[href^="/resources/reading/"]').first(), { pause: 900 });
await glide(420, 1300); await wait(700);

await menu(/Games/);
await caption('Games', 'Hangman and word search');
await click(p.getByRole('link', { name: /Sopa de letras/ }), { pause: 1000 });
await wait(700);
await click(p.getByRole('link', { name: '← All games' }), { pause: 700 });
await click(p.getByRole('link', { name: /El ahorcado/ }), { pause: 900 });
for (const l of ['A', 'E', 'R']) await click(p.getByRole('button', { name: l, exact: true }), { pause: 300 });
await wait(500);

// ------------------------------------------------------------------ 3. Plumi
await click(p.getByRole('link', { name: 'StudyBien' }).first(), { pause: 900 });
await caption('Meet Plumi, our talking feather pen');
await wait(1500);
await click(p.getByRole('link', { name: /Learn with Plumi, our talking feather pen/ }), { pause: 1100 });
await caption('Lessons from A1 to C2, one nivel at a time');
await wait(1100);
await click(p.getByRole('button', { name: /Escuchar/ }), { pause: 800 });
await caption('Pick Plumi’s voice', 'Mexico or Spain · female or male');
await click(p.getByRole('option', { name: /Sofía/ }), { pause: 1000 });
await click(p.locator('a[href="/learn/a1-animales/0"]'), { pause: 1000 });
await caption('Tap each picture to hear it');
for (const c of await p.locator('.grid button').all()) await click(c, { pause: 420 });
await click(p.getByRole('button', { name: 'Continuar' }), { pause: 800 });
await caption('Then find the right one', 'Plumi cheers you on — ¡Órale! ¡Qué padre!');
const txt = (await p.locator('main').textContent())!;
const target = /«(.+?)»/.exec(txt)?.[1] ?? '';
const cards = p.locator('.grid button');
for (let k = 0; k < 4; k++) if ((await cards.nth(k).textContent())!.includes(target)) { await click(cards.nth(k), { pause: 450 }); break; }
await click(p.getByRole('button', { name: 'Comprobar' }), { pause: 1700 });
await p.evaluate(() => {
  localStorage.setItem('studybien.plumi.v1', JSON.stringify({ lessons: { 'a1-animales:0': 3 }, xp: 25, streak: 1, lastDay: new Date().toLocaleDateString('en-CA') }));
  sessionStorage.setItem('studybien.plumi.burst', 'a1-animales:0');
});
await p.goto(B + '/learn');
await caption('¡Nivel completado! 🎉', 'Finish a nivel and it splashes ink');
await wait(2300);

// ------------------------------------------------------------------ 4. the classroom
await click(p.getByRole('link', { name: 'StudyBien' }).first(), { pause: 900 });
await caption('Teachers: create a free classroom');
await click(p.getByRole('link', { name: /I’m a teacher: create a classroom/ }), { pause: 900 });
await type(p.getByLabel('Your name'), 'Sra. García');
await type(p.getByLabel('Email'), `profe${Date.now()}@example.com`);
await type(p.getByLabel('Password'), 'unaclave1234');
await click(p.getByRole('button', { name: 'Create account' }), { pause: 1200 });
await type(p.getByLabel('Course name'), 'Español 2 · Período 3');
await p.getByLabel('Level').selectOption('spanish-2');
await click(p.getByRole('button', { name: '+ Create course' }), { pause: 1400 });
await caption('Share the join code with your class');
const code = (await p.locator('p.font-mono.text-4xl').textContent())!.trim();
await wait(2400);
await click(p.getByRole('link', { name: '+ New assignment' }), { pause: 1000 });
await caption('Assign anything from the library');
await p.getByRole('combobox', { name: 'From the library' }).selectOption({ index: 1 }); await wait(500);
const due = new Date(Date.now() + 2 * 864e5); const pad = (n: number) => String(n).padStart(2, '0');
await p.locator('input[type=datetime-local]').fill(`${due.getFullYear()}-${pad(due.getMonth() + 1)}-${pad(due.getDate())}T15:00`);
await wait(400);
await click(p.getByRole('button', { name: 'Assign to the whole course' }), { pause: 1300 });
await caption('Announcements, grades, people and a calendar');
for (const tab of ['Announcements', 'Grades', 'People']) await click(p.locator('nav').getByRole('link', { name: tab, exact: true }).first(), { pause: 750 });
await click(p.getByRole('link', { name: 'Calendar' }), { pause: 1300 });

// ------------------------------------------------------------------ 5. students
await ctx.clearCookies();
await p.goto(B + '/');
await caption('Students: join with the code', 'No email needed');
await wait(500);
await click(p.getByRole('link', { name: 'Join classroom as a student' }), { pause: 700 });
await type(p.getByLabel('Class code'), code);
await click(p.getByRole('button', { name: 'Continue' }), { pause: 1000 });
await type(p.getByLabel('First name'), 'Lucía');
await type(p.getByLabel('Last initial'), 'M');
await type(p.getByLabel('Make a PIN'), '2468');
await type(p.getByLabel('Type it again'), '2468');
await click(p.getByRole('button', { name: 'Join the class' }), { pause: 1300 });
await caption('Their own portal: assignments and grades');
await click(p.locator('nav').getByRole('link', { name: 'Assignments', exact: true }).first(), { pause: 1000 });
await click(p.locator('ul a[href*="/assignments/"]').first(), { pause: 1300 });
await caption('They do the work right here', 'Graded the moment they turn it in');
for (let k = 0; k < 2; k++) await click(p.locator('fieldset').nth(k).locator('label').nth(1), { pause: 450 });
await wait(1200);

// ------------------------------------------------------------------ end card
await p.goto(B + '/');
await caption('StudyBien · ¡Vamos a aprender!', 'Free for every teacher');
await wait(3000);

const total = now();
await p.close(); await ctx.close(); await browser.close();
const f = readdirSync('/var/tmp/tour/raw').filter((x) => x.endsWith('.webm'))[0];
renameSync(`/var/tmp/tour/raw/${f}`, '/var/tmp/tour/raw.webm');
writeFileSync('/var/tmp/tour/timeline.json', JSON.stringify({ total, clicks, marks }, null, 1));
console.log('recorded', total.toFixed(1), 's,', clicks.length, 'clicks');
