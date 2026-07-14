## Why

Clicking an x.com link — often from Slack, Signal, WhatsApp, or another app — lands you on a hostile, login-walled hellsite. The one existing extension that redirected to alternative frontends (Privacy Redirect) has been unmaintained since 2021 and bundles many redirects nobody asked for. We want a single-purpose tool: quietly send x.com status and article links to a Nitter instance instead.

## What Changes

- A new Chromium browser extension (Edge/Chrome, Manifest V3) that redirects navigations to specific x.com / twitter.com URLs to a Nitter instance.
- v1 redirects only the paths that map cleanly to Nitter:
  - `/{user}/status/{id}` (and media subpaths like `/photo/N`)
  - `/i/web/status/{id}`
  - `/i/article/{id}`
- All other x.com paths (`/home`, `/explore`, profiles, search, etc.) are left untouched.
- The query string is stripped on redirect, which also removes X's `?s=…&t=…` share-tracking parameters for free.
- The target instance is user-configurable via an options page, defaulting to `xcancel.com`, so a user can point at their own self-hosted Nitter or switch instances when one dies.

## Capabilities

### New Capabilities
- `link-redirect`: Intercepting x.com / twitter.com status and article navigations and redirecting them to the configured Nitter instance, with the query string stripped.
- `instance-config`: Storing and editing the target Nitter instance via an options page, defaulting to `xcancel.com`.

### Modified Capabilities
<!-- None — greenfield project. -->

## Impact

- New codebase: MV3 extension (`manifest.json`, a background service worker, an options page). No existing code to modify.
- Browser APIs: `declarativeNetRequest` (dynamic redirect rules), `chrome.storage.sync` (instance setting), host permissions for `x.com` / `twitter.com`.
- External dependency: relies on a live Nitter instance (`xcancel.com` by default); instance fragility is mitigated by making the target configurable.
