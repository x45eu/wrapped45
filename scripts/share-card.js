/* Locally rendered Share-Cards: no network requests or trackers. */
async function generateShareCard(format = "story") {
  const widths = { story: 1920, portrait: 1350, square: 1080 };
  const W = 1080, H = widths[format] || widths.story;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not available");
  ctx.textBaseline = "top";
  await Promise.all([
    document.fonts.load('700 120px "JetBrains Mono"'),
    document.fonts.load('400 36px "Atkinson Hyperlegible"'),
  ]);

  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#1b3047");
  g.addColorStop(1, "#19222c");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  const stats = window.navidromeApp?.stats;
  if (!stats) throw new Error("No Wrapped statistics are available");
  const numeric = (n) => Number.isFinite(Number(n)) ? Number(n) : 0;
  const totalSeconds = numeric(stats.listeningTime);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const time = days > 0 ? `${days}d ${hours}h` : `${hours}h`;
  const genre = stats.albumBasedStats?.topGenresByPlays?.[0]?.[0] || "—";
  const artist = stats.topArtistsByPlays?.[0]?.[0] || "—";
  const album = stats.topAlbumsByPlaycount?.[0]?.name || "—";
  const song = stats.topSongsByPlaycount?.[0]?.title || "—";

  const metrics = [
    { icon: "📊", title: numeric(stats.albumBasedStats?.totalPlays).toLocaleString(), label: "Total Plays" },
    { icon: "⏰", title: time, label: "Listening Time" },
    { icon: "🎵", title: genre, label: "Top Genre" },
    { icon: "🎤", title: artist, label: "Top Artist" },
    { icon: "💿", title: album, label: "Top Album" },
    { icon: "🎶", title: song, label: "Top Song" },
  ];

  function fitText(value, maxW, size, minSize = 25) {
    const text = String(value ?? "—");
    let fs = size;
    while (fs > minSize) {
      ctx.font = `700 ${fs}px "JetBrains Mono", monospace`;
      if (ctx.measureText(text).width <= maxW) break;
      fs -= 2;
    }
    ctx.font = `700 ${fs}px "JetBrains Mono", monospace`;
    if (ctx.measureText(text).width <= maxW) return { text, size: fs };
    let cut = text;
    while (cut.length > 1 && ctx.measureText(cut + "…").width > maxW) {
      cut = cut.slice(0, -1);
    }
    return { text: cut + "…", size: fs };
  }

  const username = fitText(stats.username || "My wrapped45", W - 120, H === 1080 ? 72 : 104, 36);
  ctx.font = `700 ${username.size}px "JetBrains Mono", monospace`;
  ctx.fillStyle = "#eef2f6";
  // Reserve breathing room between username and subtitle for every format
  // (including shorter/longer usernames that use a different font size).
  const usernameY = H === 1080 ? 38 : 55;
  const subtitleY = usernameY + username.size + (H === 1080 ? 42 : 52);
  ctx.fillText(username.text, (W - ctx.measureText(username.text).width) / 2, usernameY);
  ctx.fillStyle = "#9bc8ff";
  ctx.font = '400 34px "Atkinson Hyperlegible", sans-serif';
  const sub = "Your music, in numbers";
  ctx.fillText(sub, (W - ctx.measureText(sub).width) / 2, subtitleY);

  const compact = H < 1920;
  const gap = compact ? 22 : 28;
  const margin = 64;
  const top = compact ? (H === 1080 ? 245 : 305) : 310;
  const half = (W - margin * 2 - gap) / 2;
  const cardH = compact ? (H === 1080 ? 224 : 285) : 245;

  function drawCard(item, x, y, w, h) {
    ctx.fillStyle = "#24384e";
    ctx.strokeStyle = "#426386";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 20);
    ctx.fill();
    ctx.stroke();

    ctx.font = '42px "Atkinson Hyperlegible", sans-serif';
    ctx.fillStyle = "#eef2f6";
    ctx.fillText(item.icon, x + 24, y + 19);
    const title = fitText(item.title, w - 48, compact ? 42 : 49, 23);
    ctx.font = `700 ${title.size}px "JetBrains Mono", monospace`;
    ctx.fillStyle = "#eef2f6";
    ctx.fillText(title.text, x + 24, y + (compact ? 93 : 104));
    ctx.fillStyle = "#b3beca";
    ctx.font = '400 27px "Atkinson Hyperlegible", sans-serif';
    ctx.fillText(item.label, x + 24, y + h - 51);
  }

  metrics.forEach((item, i) => {
    if (compact) {
      const col = i % 2, row = Math.floor(i / 2);
      drawCard(item, margin + col * (half + gap), top + row * (cardH + gap), half, cardH);
    } else if (i < 2) {
      drawCard(item, margin + i * (half + gap), top, half, cardH);
    } else {
      drawCard(item, margin, top + (i - 1) * (cardH + gap), W - margin * 2, cardH);
    }
  });
  ctx.fillStyle = "#b3beca";
  ctx.font = '400 27px "Atkinson Hyperlegible", sans-serif';
  ctx.fillText("wrapped45", margin, H - 58);
  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}

document.addEventListener("click", async (event) => {
  const btn = event.target.closest("#shareWrappedBtn");
  if (!btn || btn.disabled) return;
  const format = document.getElementById("shareFormat")?.value || "story";
  btn.disabled = true;
  btn.textContent = "Creating card…";
  try {
    const blob = await generateShareCard(format);
    if (!blob) throw new Error("Bild konnte nicht erzeugt werden.");
    const file = new File([blob], `wrapped45-${format}.png`, { type: "image/png" });
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
    btn.textContent = "📤 Share Your wrapped45";
  }
});
