// Headless-Chrome smoke test for tic-tac-toe-bd via raw CDP.
// Run: node tests/smoke.js -- uses Playwright headless_shell cache.
// Note: /json/new requires PUT on this build (GET returns 404/405).
'use strict';
const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const PORT = 9300 + (process.pid % 500);
const HS = process.env.HOME + '/.cache/ms-playwright/chromium_headless_shell-1187/chrome-linux/headless_shell';
const FILE = 'file://' + path.resolve(__dirname, '..', 'index.html');

const errors = [];
let ws, nextId = 1;
const pending = new Map();
function send(method, params) {
  const id = nextId++;
  return new Promise((res) => {
    pending.set(id, { res });
    ws.send(JSON.stringify({ id, method, params }));
  });
}
function req(method, urlPath, body) {
  return new Promise((resolve, reject) => {
    const r = http.request({ host: '127.0.0.1', port: PORT, path: urlPath, method },
      (res) => { let d = ''; res.on('data', (c) => d += c); res.on('end', () => resolve({ status: res.statusCode, body: d })); });
    r.on('error', reject);
    if (body) r.write(body);
    r.end();
  });
}
function ev(expr) {
  return send('Runtime.evaluate', { expression: expr, returnByValue: true }).then((r) => {
    if (r.exceptionDetails) throw new Error('eval failed: ' + expr + ' :: ' + JSON.stringify(r.exceptionDetails).slice(0, 300));
    return r.result.value;
  });
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function waitFor(cond, label, timeout) {
  timeout = timeout || 8000;
  const t0 = Date.now();
  while (Date.now() - t0 < timeout) { if (await cond()) return; await sleep(150); }
  throw new Error('timeout waiting for: ' + label);
}
let checks = 0;
function check(name, ok, extra) {
  checks++;
  if (!ok) throw new Error('CHECK FAILED: ' + name + (extra !== undefined ? ' :: ' + extra : ''));
  console.log('ok ' + checks + ' - ' + name);
}

async function main() {
  const prof = '/tmp/ttt-smoke-' + process.pid;
  const chrome = spawn(HS, ['--headless=new', '--no-sandbox', '--disable-gpu',
    '--remote-debugging-port=' + PORT, '--user-data-dir=' + prof, 'about:blank'],
    { stdio: 'ignore', detached: false });
  try {
    await waitFor(async () => (await req('GET', '/json/version').catch(() => ({ status: 0 }))).status === 200, 'debug port', 20000);
    const created = await req('PUT', '/json/new?' + encodeURIComponent(FILE));
    if (created.status !== 200) throw new Error('/json/new PUT status ' + created.status);
    const target = JSON.parse(created.body);
    ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
    ws.onmessage = (m) => {
      const d = JSON.parse(m.data);
      if (d.id && pending.has(d.id)) { const p = pending.get(d.id); pending.delete(d.id); p.res(d.result); }
      if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error') errors.push('console.error');
      if (d.method === 'Runtime.exceptionThrown') errors.push('exception: ' + JSON.stringify(d.exceptionDetails).slice(0, 200));
    };
    await send('Page.enable', {}); await send('Runtime.enable', {});
    await send('Page.navigate', { url: FILE });
    await waitFor(async () => (await ev('document.readyState')) === 'complete', 'page load');
    await sleep(500);

    check('title mentions Tic-Tac-Toe', (await ev('document.title')).includes('Tic-Tac-Toe'));
    check('9 cells render', (await ev('document.querySelectorAll("#board .cell").length')) === 9);
    check('status shows your turn (AI mode, X first)', (await ev('document.getElementById("status").textContent')).includes('Your turn'));

    // Click centre (index 4) as X; AI (O) must reply within ~2s.
    await ev('document.querySelectorAll("#board .cell")[4].click()');
    await waitFor(async () => (await ev('[...document.querySelectorAll("#board .cell")].filter(c=>c.textContent).length')) === 2, 'AI reply', 5000);
    const marks = await ev('[...document.querySelectorAll("#board .cell")].map(c=>c.textContent||"-").join("")');
    check('AI replied with O (board has X and O)', marks.includes('X') && marks.includes('O'), marks);

    // 2-player win flow: X 0, O 3, X 1, O 4, X 2.
    await ev('document.getElementById("modeSel").value="2p"; document.getElementById("modeSel").dispatchEvent(new Event("change"))');
    await sleep(300);
    for (const i of [0, 3, 1, 4, 2]) { await ev('document.querySelectorAll("#board .cell")[' + i + '].click()'); await sleep(120); }
    await sleep(300);
    check('2P win status', (await ev('document.getElementById("status").textContent')).includes('Player X wins'));
    check('3 winning cells highlighted', (await ev('document.querySelectorAll("#board .cell.win").length')) === 3);
    check('score X is 1', (await ev('document.getElementById("scoreX").textContent')) === '1');

    // New game clears the board.
    await ev('document.getElementById("newBtn").click()'); await sleep(200);
    check('new game clears board', (await ev('[...document.querySelectorAll("#board .cell")].filter(c=>c.textContent).length')) === 0);

    // Bengali toggle: tagline + lang button flip to English.
    await ev('document.getElementById("langBtn").click()'); await sleep(200);
    const bnTag = await ev('document.querySelector(".tagline").textContent');
    check('BN tagline renders Bengali', /[\u0980-\u09FF]/.test(bnTag), bnTag);
    check('lang button now offers English', (await ev('document.getElementById("langBtn").textContent')) === 'English');
    const bnDigit = await ev('document.getElementById("scoreDraws").textContent');
    check('BN score digit renders', /[\u09E6-\u09EF]/.test(bnDigit), bnDigit);

    // 390px mobile: no horizontal overflow.
    await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    await sleep(300);
    const sw = await ev('document.documentElement.scrollWidth');
    const iw = await ev('window.innerWidth');
    check('390px no horizontal overflow', sw <= iw, sw + ' vs ' + iw);

    check('zero console/page errors', errors.length === 0, errors.join(' | '));
    console.log('ALL ' + checks + ' SMOKE CHECKS PASSED');
  } finally {
    try { ws && ws.close(); } catch (e) {}
    chrome.kill('SIGKILL');
    fs.rmSync(prof, { recursive: true, force: true });
  }
}
main().catch((e) => { console.error('SMOKE FAILED: ' + e.message); process.exit(1); });
