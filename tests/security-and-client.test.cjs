'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const clientSource = fs.readFileSync(path.join(root, 'scripts/navidrome-client.js'), 'utf8');
const displaySource = fs.readFileSync(path.join(root, 'scripts/wrapped-display.js'), 'utf8');

function createClient(fetchMock) {
  const context = {
    URL, URLSearchParams, AbortController, setTimeout, clearTimeout,
    fetch: fetchMock,
    crypto: { getRandomValues(buffer) { buffer.fill(7); return buffer; } },
    md5: () => 'derived-token'
  };
  vm.createContext(context);
  vm.runInContext(clientSource + '\nthis.Client = ClientSideND;', context);
  return context.Client;
}
function result(status, body = { status: 'ok' }) {
  return { ok: status >= 200 && status < 300, status, async json() { return { 'subsonic-response': body }; } };
}

test('rejects insecure and credential-bearing Navidrome URLs', () => {
  const Client = createClient(async () => result(200));
  assert.throws(() => new Client('http://music.example.org', 'u', 'p'), /HTTPS/i);
  assert.throws(() => new Client('https://u:p@music.example.org', 'u', 'p'), /without credentials/i);
  assert.throws(() => new Client('https://music.example.org?token=bad', 'u', 'p'), /without credentials/i);
});

test('POST requests keep tokens and passwords out of the URL', async () => {
  let captured;
  const Client = createClient(async (url, options) => {
    captured = { url, options };
    return result(200);
  });
  const client = new Client('https://music.example.org', 'test-user', 'private-password');
  await client._req('ping');
  assert.equal(captured.url, 'https://music.example.org/rest/ping');
  assert.equal(captured.options.method, 'POST');
  assert.equal(captured.options.credentials, 'omit');
  assert.equal(captured.options.cache, 'no-store');
  const body = new URLSearchParams(captured.options.body);
  assert.equal(body.get('u'), 'test-user');
  assert.equal(body.get('t'), 'derived-token');
  assert.ok(body.get('s'));
  assert.ok(!captured.options.body.includes('private-password'));
});

test('retries transient 503 failures but succeeds on the third attempt', async () => {
  let calls = 0;
  const Client = createClient(async () => { calls++; return calls < 3 ? result(503) : result(200); });
  const client = new Client('https://music.example.org', 'u', 'p');
  client.waitBeforeRetry = async () => {};
  await client._req('ping');
  assert.equal(calls, 3);
});

test('authentication errors do not cause credential replay retries', async () => {
  let calls = 0;
  const Client = createClient(async () => { calls++; return result(401); });
  const client = new Client('https://music.example.org', 'u', 'p');
  client.waitBeforeRetry = async () => {};
  await assert.rejects(client._req('ping'), /Anmeldung fehlgeschlagen/);
  assert.equal(calls, 1);
});

test('cancellation immediately prevents new API requests', async () => {
  let calls = 0;
  const Client = createClient(async () => { calls++; return result(200); });
  const client = new Client('https://music.example.org', 'u', 'p');
  client.cancel();
  await assert.rejects(client._req('ping'), /abgebrochen/);
  assert.equal(calls, 0);
});

test('escapes untrusted titles and HTML attributes', () => {
  const context = {};
  vm.createContext(context);
  vm.runInContext(displaySource + '\nthis.Display = WrappedDisplay;', context);
  assert.equal(context.Display.escapeHTML('<img src=x onerror="alert(1)">'), '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');
  assert.equal(context.Display.escapeHTML("Rock & Roll's"), 'Rock &amp; Roll&#39;s');
  assert.equal(context.Display.escapeHTML(null), '');
});

test('markup renderer enforces a strict whitelist and removes inline handlers', () => {
  assert.match(displaySource, /safeMarkup\(markup\)/);
  assert.match(displaySource, /replaceChildren\(WrappedDisplay\.safeMarkup/);
  assert.doesNotMatch(displaySource, /onclick="location\.reload\(\)"/);
});

test('rating message never returns NaN or Infinity', () => {
 const context={window:{WrappedI18n:{language:'de'}}}; vm.createContext(context);
 vm.runInContext(displaySource+'\nthis.Display=WrappedDisplay;',context);
 const d=Object.create(context.Display.prototype);
 for(const args of [[0,915,0],[undefined,915,0],['N/A',915,0],[null,0,0],[Infinity,915,NaN],[17,100,5]]) assert.doesNotMatch(d.getRatingMessage(...args),/NaN|Infinity|undefined|N\/A/);
 assert.match(d.getRatingMessage(0,915,0),/keine Titel bewertet/);
 assert.match(d.getRatingMessage(17,100,5),/17%/);
 assert.equal(d.safeAccess({count:0},'count','N/A'),0);
});
