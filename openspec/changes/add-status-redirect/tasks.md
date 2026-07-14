## 1. Extension scaffold

- [x] 1.1 Create `manifest.json` (MV3): name, version, `declarativeNetRequest` + `storage` permissions, host permissions for `*://x.com/*` and `*://twitter.com/*`, background service worker, and options page. _(Uses `declarativeNetRequestWithHostAccess` — same redirect capability, no extra install-time warning; manifest authored as `manifest.config.ts` + emitted by crxjs.)_
- [x] 1.2 Add a toolbar icon set (16/32/48/128) and placeholder assets. _(Generated solid emerald placeholder PNGs in `icons/`.)_
- [x] 1.3 Add a build/dev setup with Vite and vanilla TypeScript; ensure it emits a loadable unpacked extension. _(Vite 8 + `@crxjs/vite-plugin`; `npm run build` emits a loadable `dist/`, verified.)_

## 2. Redirect engine

- [x] 2.1 Implement a `buildRules(instance)` function returning the two DNR dynamic redirect rules (status, article) with `regexFilter` capturing path-only and `regexSubstitution` into `https://<instance>/\1`. _(Filters anchored `^…$` so the whole URL — incl. query — is replaced, stripping the query.)_
- [x] 2.2 In the service worker, apply rules via `declarativeNetRequest.updateDynamicRules` on `onInstalled` and on startup, reading the instance from `chrome.storage.sync` (default `xcancel.com`).
- [x] 2.3 Rebuild rules on `chrome.storage.onChanged` for the instance key.

## 3. Options page

- [x] 3.1 Build `options.html` + TS: a single "Nitter instance" text field defaulting to `xcancel.com`, load-from and save-to `chrome.storage.sync`.
- [x] 3.2 Normalize the entered value (strip scheme and trailing slash; ignore empty → keep default) before saving.

## 4. Verification

_Redirect/normalization logic is covered by 18 passing unit tests (`npm test`): status/article/media/query-strip redirects, http+https, twitter.com, and home/profile/reserved paths left untouched, plus custom-instance targeting. Tasks below are the manual in-browser confirmation — they require **Load unpacked** (a native file dialog the tooling can't drive), so they're left for a human._

- [x] 4.1 Load unpacked in Chrome and Edge; confirm `x.com/{user}/status/{id}`, `/i/web/status/{id}`, and `/i/article/{id}` redirect to the instance with the query stripped. _(Confirmed working in-browser.)_
- [x] 4.2 Confirm `x.com/home` and a bare profile (`x.com/{user}`) are NOT redirected. _(Confirmed working in-browser.)_
- [x] 4.3 Confirm changing the instance in options updates redirects without a browser restart. _(Confirmed working in-browser.)_
