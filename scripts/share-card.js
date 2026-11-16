/* 9:16 SHARE-CARD */
async function generateShareCard() {
  const W = 1080,
    H = 1920;
  const M = 80;
  const CARD_H = 280;
  const GAP = 40;
  const bgGrad = ["#1b3047", "#19222c"];

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  ctx.textBaseline = "top";

  // Font is bundled with wrapped45; no requests to external font providers.
  await Promise.all([
    document.fonts.load('700 120px "JetBrains Mono"'),
    document.fonts.load('400 36px "Atkinson Hyperlegible"'),
  ]);
  const center = (txt) => (W - ctx.measureText(txt).width) / 2;
  const roundRect = (x, y, w, h, r) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  };


  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, bgGrad[0]);
  g.addColorStop(1, bgGrad[1]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // gather stats
  const s = window.navidromeApp?.stats || {};
  const num = (n, def = 0) => (typeof n === "number" && !isNaN(n) ? n : def);
  const plays = num(s.albumBasedStats?.totalPlays);
  const days = Math.floor(num(s.listeningTime) / 86400);
  const hours = Math.floor((num(s.listeningTime) % 86400) / 3600);

  const topGenEntry = s.albumBasedStats?.topGenresByPlays?.[0] || [];
  const topGen = topGenEntry[0] || "—";
  const genPlays = num(topGenEntry[1]);

  const topArtEntry = s.topArtistsByPlays?.[0] || [];
  const topArt = topArtEntry[0] || "—";
  const artPlays = num(topArtEntry[1]);

  const topAlbEntry = s.topAlbumsByPlaycount?.[0] || {};
  const topAlb = topAlbEntry.name || "—";
  const albPlays = num(topAlbEntry.playCount);

  const topSongEntry = s.topSongsByPlaycount?.[0] || {};
  const topSongTitle = topSongEntry.title || "—";
  const topSongPlays = num(topSongEntry.plays);

  /* ----------  title ---------- */
  ctx.fillStyle = "#fff";
  ctx.font = 'bold 120px "JetBrains Mono", sans-serif';
  const displayUser = String(s.username || "My Wrapped");
  const safeUsername = displayUser.length > 22 ? displayUser.slice(0, 21) + "…" : displayUser;
  let titleSize = 120;
  do {
    ctx.font = `bold ${titleSize}px "JetBrains Mono", sans-serif`;
    if (ctx.measureText(safeUsername).width <= W - M * 2) break;
    titleSize -= 5;
  } while (titleSize > 48);
  ctx.fillText(safeUsername, center(safeUsername), 120);

  /* ---------- plays + time ---------- */
  const COL_W = (W - M * 3) / 2;
  const topRowY = 320;
  drawCard(
    {
      icon: "📊",
      name: plays.toLocaleString(),
      plays: null,
      lbl: "Total Plays",
    },
    M + 0.000001,
    topRowY
  );
  drawCard(
    {
      icon: "⏰",
      name: `${days ? `${days}d ${hours}h` : `${hours}h`}`,
      plays: null,
      lbl: "Listening Time",
    },
    M + COL_W + M,
    topRowY
  );

  /* ---------- top items ---------- */
  let y = topRowY + CARD_H + GAP;
  const remaining = [
    { icon: "🎵", name: topGen, plays: genPlays, lbl: "Top Genre" },
    { icon: "🎤", name: topArt, plays: artPlays, lbl: "Top Artist" },
    { icon: "💿", name: topAlb, plays: albPlays, lbl: "Top Album" },
    { icon: "🎶", name: topSongTitle, plays: topSongPlays, lbl: "Top Song" },
  ];
  remaining.forEach((c) => {
    drawCard(c, M, y);
    y += CARD_H + GAP;
  });

  function drawCard(c, x, y) {
    const cardWidth = x === M ? W - M * 2 : COL_W;
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,.25)";
    ctx.shadowBlur = 30;
    roundRect(x, y, cardWidth, CARD_H, 32);
    ctx.fillStyle = "rgba(255,255,255,.1)";
    ctx.fill();
    ctx.restore();

    ctx.font = '80px "Atkinson Hyperlegible", sans-serif';
    ctx.fillStyle = "#fff";
    ctx.fillText(c.icon, x + 40, y + 40);

    let fontSize = 64;
    const maxW = cardWidth - 80 - (c.plays != null ? 220 : 0);
    ctx.font = `bold ${fontSize}px "JetBrains Mono", sans-serif`;
    while (ctx.measureText(c.name).width > maxW && fontSize > 36) {
      fontSize -= 2;
      ctx.font = `bold ${fontSize}px "JetBrains Mono", sans-serif`;
    }
    let [line1, line2] = breakLines(c.name, maxW, fontSize);
    const lineH = fontSize * 1.2;
    ctx.fillText(line1, x + 40, y + 140);
    if (line2) ctx.fillText(line2, x + 40, y + 140 + lineH);

    if (c.plays != null) {
      ctx.font = '40px "JetBrains Mono", sans-serif';
      ctx.fillStyle = "rgba(255,255,255,.8)";
      ctx.fillText(
        `${c.plays.toLocaleString()} plays`,
        x + cardWidth - 220,
        y + 210
      );
    }

    ctx.font = '36px "Atkinson Hyperlegible", sans-serif';
    ctx.fillStyle = "rgba(255,255,255,.6)";
    ctx.fillText(c.lbl, x + 40, y + CARD_H - 60);
  }

  /* ----------  line-break + ellipsis helper ---------- */
  function breakLines(value, maxW, fontSize) {
    const text = String(value ?? "");
    ctx.font = `bold ${fontSize}px "JetBrains Mono", sans-serif`;
    const fit = (str) => ctx.measureText(str).width <= maxW;
    if (fit(text)) return [text, ""];
    let first = "";
    const words = text.split(/\s+/);
    while (words.length && fit(first ? first + " " + words[0] : words[0])) {
      first = first ? first + " " + words.shift() : words.shift();
    }
    if (!first) {
      let rest = text;
      while (rest && fit(first + rest[0])) { first += rest[0]; rest = rest.slice(1); }
      words.splice(0, words.length, rest);
    }
    let second = words.join(" ").trim();
    if (!first) first = "…";
    if (!fit(second)) {
      while (second && !fit(second + "…")) second = second.slice(0, -1);
      second += "…";
    }
    return [first, second];
  }

  return new Promise((res) => canvas.toBlob(res, "image/png", 0.95));
}

/* Delegate click handling to avoid perpetual polling for a dynamic button. */
document.addEventListener("click", async (event) => {
  const btn = event.target.closest("#shareWrappedBtn");
  if (!btn || btn.disabled) return;
  btn.disabled = true;
  btn.textContent = "Creating card…";
  try {
    const blob = await generateShareCard();
    if (!blob) throw new Error("Bild konnte nicht erzeugt werden.");
    const file = new File([blob], "wrapped45.png", { type: "image/png" });
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ title: "My wrapped45", files: [file] });
    } else {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  } catch (error) {
    if (error.name !== "AbortError") alert("Share-Card konnte nicht erstellt werden.");
  } finally {
    btn.disabled = false;
    btn.textContent = "📤 Share Your Wrapped";
  }
});
