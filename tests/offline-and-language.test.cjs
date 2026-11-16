'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('German and English text can switch without an external translation service', () => {
  let changeEvent;
  const document = {
    documentElement: { lang: '' },
    querySelectorAll: () => [],
    createTreeWalker: () => ({ nextNode: () => null }),
    body: {},
    addEventListener(name, callback) { if (name === 'DOMContentLoaded') changeEvent = callback; }
  };
  const storage = new Map();
  const window = {};
  const context = {
    window, document, NodeFilter: { SHOW_TEXT: 4 },
    localStorage: { getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value) }
  };
  vm.createContext(context);
  vm.runInContext(read('scripts/i18n.js'), context);
  changeEvent();
  assert.equal(window.WrappedI18n.t('Username'), 'Benutzername');
  window.WrappedI18n.changeLanguage('en');
  assert.equal(window.WrappedI18n.t('Username'), 'Username');
  assert.equal(document.documentElement.lang, 'en');
  assert.equal(storage.get('wrapped45_language'), 'en');
});

test('service worker ignores API requests and all cross-origin traffic', () => {
  const listeners = {};
  const context = {
    URL,
    self: {
      location: { origin: 'https://example.org' },
      registration: { scope: 'https://example.org/wrapped45/' },
      addEventListener: (type, callback) => listeners[type] = callback
    },
  };
  vm.createContext(context);
  vm.runInContext(read('sw.js'), context);
  let intercepted = false;
  const check = (url, method) => listeners.fetch({
    request: { url, method, mode: 'cors' },
    respondWith: () => intercepted = true
  });
  check('https://music.example.org/rest/ping', 'GET');
  assert.equal(intercepted, false);
  check('https://example.org/wrapped45/rest/getAlbum', 'POST');
  assert.equal(intercepted, false);
  check('https://example.org/wrapped45/private-report.json', 'GET');
  assert.equal(intercepted, false);
  assert.match(read('sw.js'), /CACHE_NAME/);
  assert.doesNotMatch(read('sw.js'), /localStorage|navidrome_wrapped/);
});

test('public pages reference only local fonts and scripts', () => {
  const index = read('index.html');
  const share = read('scripts/share-card.js');
  const css = read('styles/main.css');
  assert.match(index, /scripts\/i18n\.js/);
  assert.match(index, /scripts\/pwa\.js/);
  assert.doesNotMatch(share, /https:\/\/.*(?:fonts|rsms)/);
  assert.match(css, /JetBrains Mono/);
  assert.match(css, /Atkinson Hyperlegible/);
});

test('demo mode and durable Wrapped cache remain disabled', () => {
  const html = read('index.html');
  const app = read('scripts/app.js');
  assert.doesNotMatch(html, /demo-data\.js|id="demoBtn"/);
  assert.doesNotMatch(app, /generateDemoWrapped|saveWrap/);
  assert.match(read('scripts/utils.js'), /removeItem\("navidrome_wrapped"\)/);
});
