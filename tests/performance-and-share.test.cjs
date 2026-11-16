'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');

test('album scan uses bounded concurrency and produces a valid result', async () => {
  let running = 0, maxRunning = 0, totalAlbumRequests = 0;
  const fakeFetch = async (url, opts) => {
    const endpoint = url.split('/').at(-1);
    const data = new URLSearchParams(opts.body);
    if (endpoint === 'getAlbumList2') {
      return response({ albumList2: { album: Number(data.get('offset')) === 0
        ? Array.from({ length: 12 }, (_, i) => ({ id: 'a' + i, name: 'Album ' + i, playCount: 3 }))
        : [] } });
    }
    if (endpoint === 'getAlbum') {
      running++;
      maxRunning = Math.max(running, maxRunning);
      totalAlbumRequests++;
      await new Promise(resolve => setTimeout(resolve, 3));
      running--;
      return response({ album: {
        name: 'Album',
        song: [{ title: 'A Track', duration: 180, playCount: 3, artist: 'Artist', artistId: 'artist1',
          artists: [{ id: 'artist1', name: 'Artist' }], genre: 'Rock', userRating: 4 }]
      } });
    }
    return response({});
  };
  function response(data) {
    return { ok: true, status: 200, async json() { return { 'subsonic-response': { status: 'ok', ...data } }; } };
  }
  const context = {
    URL, URLSearchParams, AbortController,
    setTimeout, clearTimeout,
    fetch: fakeFetch,
    crypto: { getRandomValues(buffer) { buffer.fill(1); return buffer; } },
    md5: () => 'token'
  };
  vm.createContext(context);
  vm.runInContext(read('scripts/navidrome-client.js') + '\nthis.Client = ClientSideND;', context);
  const client = new context.Client('https://music.example.org', 'user', 'pass');
  const stats = await client.stats(() => {});
  assert.equal(totalAlbumRequests, 12);
  assert.equal(stats.totalSongs, 12);
  assert.equal(stats.albumBasedStats.totalPlays, 36);
  assert.ok(maxRunning <= 4, 'must never exceed 4 concurrent album requests');
  assert.ok(maxRunning >= 2, 'must process albums concurrently');
});

test('all share-card formats export their advertised pixel dimensions', async () => {
  const generated = [];
  const fakeContext = {
    createLinearGradient: () => ({ addColorStop() {} }),
    fillRect() {}, fillText() {}, beginPath() {}, roundRect() {}, fill() {}, stroke() {},
    measureText: text => ({ width: String(text).length * 18 }),
  };
  const doc = {
    addEventListener() {},
    fonts: { load: async () => [] },
    createElement(tag) {
      assert.equal(tag, 'canvas');
      const canvas = {
        width: 0, height: 0,
        getContext: () => fakeContext,
        toBlob(callback) {
          generated.push([this.width, this.height]);
          callback({ type: 'image/png' });
        }
      };
      return canvas;
    }
  };
  const window = { navidromeApp: { stats: {
    username: 'User',
    listeningTime: 7200,
    albumBasedStats: { totalPlays: 42, topGenresByPlays: [['Rock', 42]] },
    topArtistsByPlays: [['Artist', 42]],
    topAlbumsByPlaycount: [{ name: 'Album' }],
    topSongsByPlaycount: [{ title: 'Song' }]
  }}};
  const context = { window, document: doc, navigator: {}, console };
  vm.createContext(context);
  vm.runInContext(read('scripts/share-card.js') + '\nthis.makeCard = generateShareCard;', context);
  await context.makeCard('story');
  await context.makeCard('portrait');
  await context.makeCard('square');
  assert.deepEqual(generated, [[1080, 1920], [1080, 1350], [1080, 1080]]);
});
