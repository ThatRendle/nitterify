# nitterify

A deliberately tiny Chromium (Edge/Chrome) extension that redirects **x.com /
twitter.com status and article links** to a [Nitter](https://github.com/zedeus/nitter)
instance — defaulting to [xcancel.com](https://xcancel.com).

It does one thing. No profile/search/home redirects, no other services, no
in-page link rewriting. When you click a tweet or article link — from Slack,
Signal, a search result, anywhere — the navigation is redirected before x.com
loads. The query string (including X's `?s=…&t=…` share-tracking) is stripped.

## What gets redirected

| URL | Result |
| --- | --- |
| `x.com/{user}/status/{id}` (and `/photo/N`) | → `<instance>/{user}/status/{id}` |
| `x.com/i/web/status/{id}` | → `<instance>/i/web/status/{id}` |
| `x.com/i/article/{id}` | → `<instance>/i/article/{id}` |
| everything else on x.com | left untouched |

`twitter.com` links are handled identically.

## How it works

Redirection is done natively by Chrome's `declarativeNetRequest` engine. A
background service worker only wakes to (re)build the dynamic redirect rules on
install, on browser start, and whenever the configured instance changes — it is
not involved per-request.

The target instance is configurable on the options page (defaults to
`xcancel.com`), so you can point at your own self-hosted Nitter or switch when an
instance goes down.

## Develop

```bash
npm install
npm run dev      # Vite dev build with HMR
npm run build    # typecheck + production build into dist/
npm test         # unit tests for the redirect + normalization logic
```

## Load unpacked

1. `npm run build`
2. Open `chrome://extensions` (or `edge://extensions`) and enable **Developer mode**.
3. **Load unpacked** → select the `dist/` folder.
4. Set your preferred instance via the extension's **Options** page.
