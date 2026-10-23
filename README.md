# Your streamer page

A free, one-page link site for your stream. Everything about you lives in **one file: `config.json`**.

Live example: albruh_u's page (this repo).

## Change your page (no coding)

1. On GitHub, open `config.json` and click the ✏️ pencil.
2. Change the text between the quotes.
3. Click **Commit changes**. Your page updates in about a minute.

| Field | What it does |
|-------|--------------|
| `name` | Big name at the top |
| `twitch` | Your Twitch username. Shows a **LIVE / OFFLINE** pill, and your stream plays on the page while you're live |
| `avatar` | Your profile picture (see below) |
| `tagline` | One short line under your name |
| `bio` | Optional "About" paragraph. Leave `""` to hide it |
| `theme` | Three colors: `primary`, `accent` (the gradient), `glow` (background tint). Use hex codes like `"#a855f7"` |
| `featured` | The big cards. Each has a `title`, short `text`, and `url` |
| `links` | Your link list. Just a `label` and a `url`; the icon is picked from the URL automatically |
| `schedule` | Optional, e.g. `[{ "day": "Tue", "time": "7 PM PT" }]`. Leave `[]` to hide it |
| `ticker` | The scrolling bar at the bottom. Leave `[]` to hide it |

**Careful with commas and quotes.** If something breaks, the page tells you which line has the typo.

## Change your photo

Open the `assets` folder → **Add file → Upload files** → drop a square picture named `avatar.jpg` → **Commit changes**.

## Discord / X link previews

Previews come from the few lines at the top of `index.html` (title, description, image). Update them if you change your name.

---

Supported link icons: Twitch, YouTube, TikTok, X, Instagram, Discord, Kick, Ko-fi, Bluesky, Threads, Patreon, Spotify, Steam, email (`mailto:`), and a globe for everything else.
