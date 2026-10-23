import ICONS from './icons.js';

// Everything personal lives in config.json. This file only reads it and draws the page.

const CREDIT = { text: 'page by albruh', url: 'https://albruh.tech' };

// Hostname -> icon name, so streamers only paste a URL.
const HOST_ICONS = [
  [/twitch\.tv$/, 'twitch'], [/(^|\.)x\.com$|twitter\.com$/, 'x'], [/instagram\.com$/, 'instagram'],
  [/youtube\.com$|youtu\.be$/, 'youtube'], [/tiktok\.com$/, 'tiktok'], [/discord\.(gg|com)$/, 'discord'],
  [/kick\.com$/, 'kick'], [/ko-fi\.com$/, 'kofi'], [/bsky\.app$/, 'bluesky'], [/threads\.(net|com)$/, 'threads'],
  [/patreon\.com$/, 'patreon'], [/spotify\.com$/, 'spotify'], [/steam(community|powered)\.com$/, 'steam'],
];

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function safeUrl(raw) {
  try {
    const url = new URL(raw, location.href);
    return ['https:', 'http:', 'mailto:'].includes(url.protocol) ? url : null;
  } catch {
    return null;
  }
}

function iconFor(url, name) {
  if (!name) {
    if (url.protocol === 'mailto:') name = 'email';
    else name = HOST_ICONS.find(([re]) => re.test(url.hostname.replace(/^www\./, '')))?.[1] ?? 'globe';
  }
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', ICONS[name] ?? ICONS.globe);
  svg.append(path);
  return svg;
}

// "https://www.x.com/albruh_u/" -> "x.com/albruh_u"
function prettyUrl(url) {
  if (url.protocol === 'mailto:') return url.pathname;
  return (url.hostname.replace(/^www\./, '') + url.pathname).replace(/\/$/, '');
}

function applyTheme(theme = {}) {
  const root = document.documentElement.style;
  for (const key of ['primary', 'accent', 'glow']) {
    if (/^#[0-9a-f]{3,8}$/i.test(theme[key] ?? '')) root.setProperty(`--${key}`, theme[key]);
  }
}

function renderTopbar(cfg) {
  const bar = document.getElementById('topbar');
  const brand = el('div', 'brand');
  brand.append(el('span', 'brand-mark', cfg.name.trim()[0].toUpperCase()));
  const text = el('div', 'brand-text');
  text.append(el('strong', null, cfg.name));
  if (cfg.twitch) text.append(el('span', null, `twitch.tv/${cfg.twitch}`));
  brand.append(text);

  const status = el('div', 'status');
  status.id = 'status';
  status.hidden = true;
  bar.append(brand, status);
}

function renderHero(cfg, page) {
  const hero = el('section', 'hero');
  if (cfg.avatar) {
    const ring = el('div', 'avatar');
    const img = el('img');
    img.src = cfg.avatar;
    img.alt = cfg.name;
    img.width = img.height = 120;
    ring.append(img);
    hero.append(ring);
  }
  hero.append(el('h1', 'display', cfg.name));
  if (cfg.tagline) hero.append(el('p', 'tagline', cfg.tagline));
  page.append(hero);
}

function renderFeatured(items, page) {
  const cards = (items ?? []).map((item) => [item, safeUrl(item.url)]).filter(([, url]) => url);
  if (!cards.length) return;
  const wrap = el('section', 'featured');
  for (const [item, url] of cards) {
    const a = el('a', 'feature');
    a.href = url.href;
    a.target = '_blank';
    a.rel = 'noopener';
    const tile = el('span', 'tile');
    tile.append(iconFor(url, item.icon));
    const body = el('span', 'feature-body');
    body.append(el('span', 'feature-title', item.title));
    if (item.text) body.append(el('span', 'feature-text', item.text));
    a.append(tile, body);
    wrap.append(a);
  }
  page.append(wrap);
}

function renderLinks(links, page) {
  const rows = (links ?? []).map((link) => [link, safeUrl(link.url)]).filter(([, url]) => url);
  if (!rows.length) return;
  const list = el('ul', 'links');
  for (const [link, url] of rows) {
    const a = el('a', 'link');
    a.href = url.href;
    a.target = '_blank';
    a.rel = 'noopener';
    const tile = el('span', 'tile');
    tile.append(iconFor(url, link.icon));
    const body = el('span', 'link-body');
    body.append(el('span', 'link-label', link.label), el('span', 'link-sub', link.note || prettyUrl(url)));
    a.append(tile, body, el('span', 'arrow', '→'));
    const li = el('li');
    li.append(a);
    list.append(li);
  }
  page.append(list);
}

function renderSchedule(slots, page) {
  if (!slots?.length) return;
  const section = el('section', 'card schedule');
  section.append(el('h2', 'label', 'Stream schedule'));
  const list = el('ul');
  for (const slot of slots) {
    const li = el('li');
    li.append(el('span', 'day', slot.day), el('span', null, slot.time));
    list.append(li);
  }
  section.append(list);
  page.append(section);
}

function renderBio(bio, page) {
  if (!bio?.trim()) return;
  const section = el('section', 'card bio');
  section.append(el('h2', 'label', 'About'));
  for (const para of bio.split(/\n+/)) section.append(el('p', null, para));
  page.append(section);
}

function renderFooter(cfg, page) {
  const footer = el('footer', 'footer');
  if (cfg.credit !== false) {
    const a = el('a', null, CREDIT.text);
    a.href = CREDIT.url;
    a.target = '_blank';
    a.rel = 'noopener';
    footer.append(a);
  }
  page.append(footer);
}

function renderTicker(items) {
  if (!items?.length) return;
  const ticker = document.getElementById('ticker');
  ticker.append(el('span', 'ticker-tag', 'GG'));
  const track = el('div', 'ticker-track');
  // Two identical halves so the CSS loop is seamless.
  for (let copy = 0; copy < 2; copy++) {
    const half = el('div', 'ticker-half');
    if (copy) half.setAttribute('aria-hidden', 'true');
    for (const item of items) half.append(el('span', null, item));
    track.append(half);
  }
  ticker.append(track);
  ticker.hidden = false;
  document.body.classList.add('has-ticker');
}

// Live status via DecAPI (free relay, no key). Any failure just leaves the pill hidden.
async function checkLive(channel, page) {
  if (!/^\w{3,25}$/.test(channel ?? '')) return;
  try {
    const res = await fetch(`https://decapi.me/twitch/uptime/${channel}`);
    if (!res.ok) return;
    const text = (await res.text()).trim();
    const live = /\d+\s+(second|minute|hour|day)/.test(text);
    if (!live && !/offline/i.test(text)) return;

    const status = document.getElementById('status');
    status.classList.toggle('live', live);
    status.append(el('span', 'dot'), el('span', null, live ? 'Live now' : 'Offline'));
    status.hidden = false;

    if (live && location.hostname) {
      const frame = el('iframe', 'player');
      frame.src = `https://player.twitch.tv/?channel=${channel}&parent=${location.hostname}&muted=true`;
      frame.title = `${channel} live on Twitch`;
      frame.allowFullscreen = true;
      const card = el('section', 'card player-card');
      card.append(frame);
      page.querySelector('.hero').after(card);
    }
  } catch {
    // Relay down or blocked: the page is fine without the pill.
  }
}

function showError(message) {
  const page = document.getElementById('page');
  const box = el('div', 'card error');
  box.append(el('h2', 'label', 'This page has a setup problem'), el('p', null, message));
  page.replaceChildren(box);
}

async function main() {
  let cfg;
  try {
    const res = await fetch('config.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error(`Could not load config.json (HTTP ${res.status}).`);
    cfg = JSON.parse(await res.text());
  } catch (err) {
    return showError(err instanceof SyntaxError ? `config.json has a typo: ${err.message}` : err.message);
  }
  if (!cfg.name?.trim()) return showError('config.json is missing "name".');

  applyTheme(cfg.theme);
  const page = document.getElementById('page');
  page.replaceChildren();
  renderTopbar(cfg);
  renderHero(cfg, page);
  renderFeatured(cfg.featured, page);
  renderLinks(cfg.links, page);
  renderSchedule(cfg.schedule, page);
  renderBio(cfg.bio, page);
  renderFooter(cfg, page);
  renderTicker(cfg.ticker);
  checkLive(cfg.twitch, page);
}

main();
