## Context

nitterify is a greenfield Manifest V3 browser extension for Chromium browsers (Edge and Chrome share the engine, so one codebase covers both). It redirects a narrow set of x.com / twitter.com navigations to a Nitter instance. The motivating case is clicking an x.com link from another app (Slack, Signal, WhatsApp), so redirection must happen at the navigation layer, not by rewriting links in already-loaded pages.

Constraints:
- MV3 removed blocking `webRequest`; the sanctioned redirect mechanism is `declarativeNetRequest` (DNR).
- The target instance is user-configurable, so redirect targets are not known at build time — static manifest rules cannot encode them.
- DNR's `regexFilter` uses RE2, which does not support lookahead/lookbehind.
- Public Nitter instances are fragile post-API-lockdown; `xcancel.com` is a current survivor but not guaranteed permanent.

## Goals / Non-Goals

**Goals:**
- Redirect x.com / twitter.com status and article navigations to a configured Nitter instance, from any navigation source.
- Strip the query string on redirect (removes X share-tracking parameters for free).
- Let the user configure the target instance, defaulting to `xcancel.com`.
- Work identically on Edge and Chrome from one codebase.

**Non-Goals:**
- No content-script / in-page link rewriting.
- No redirect of profiles, search, `/home`, or other unmapped paths in v1.
- No support for non-Nitter redirect targets (YouTube→Invidious, etc.).
- No handling of `t.co` shortened links (target is unknown without following them).

## Decisions

### Navigation redirect via `declarativeNetRequest`, not DOM rewriting
The itch is clicking links that originate outside the browser (chat apps, email, search). DOM rewriting only affects links on pages the extension has already processed, so it would miss the real-world case. DNR redirects any navigation to a matching URL regardless of source, needs no persistent background worker, and is enforced natively. *Alternative considered:* content-script href rewriting (Privacy Redirect's approach) — rejected as insufficient coverage and more code.

### Dynamic DNR rules built by a service worker
Because the instance is configurable, redirect targets come from storage at runtime, so static manifest rules won't work. A service worker rebuilds the rule set via `declarativeNetRequest.updateDynamicRules` on install/update and whenever `chrome.storage` changes. The worker only wakes to rebuild rules; per-request redirecting is done by the native DNR engine. *Alternative considered:* static rules with a hardcoded instance — rejected because instance fragility makes configurability essential.

### `chrome.storage.sync` for the instance setting
A single host string. `sync` persists across restarts and across the user's signed-in browsers. Default applied in code when unset.

### v1 scope limited to status and article paths
These paths (`/{user}/status/{id}`, `/i/web/status/{id}`, `/i/article/{id}`) all contain a distinguishing keyword segment, so their regexes cannot collide with x.com's reserved words (`/home`, `/explore`, etc.). This sidesteps the whole reserved-word problem and the RE2 no-lookahead constraint entirely — no `allow`-rule exclusions needed. Bare-profile and search redirects are deferred.

### Query string stripped by capturing path only
The DNR `regexSubstitution` emits exactly what the capture groups build. Capturing only the path portion (excluding `?...`) means the query is simply never re-emitted — stripping is free and also removes `?s=…&t=…` tracking cruft.

Redirect rules (targeting `<instance>` from storage):
- `^https?://(?:x|twitter)\.com/(.+/status/[^?]*)` → `https://<instance>/\1`
- `^https?://(?:x|twitter)\.com/(i/article/[^?]*)` → `https://<instance>/\1`

## Risks / Trade-offs

- **Configured Nitter instance goes down** → target is user-editable, so the user can switch; default `xcancel.com` is a current survivor.
- **Nitter changes its URL scheme / stops mirroring a path 1:1** → v1 covers only status and article paths, which mirror Twitter's scheme today; broader coverage is deferred until verified.
- **Brief request to x.com's edge may begin before DNR redirects** → acceptable; DNR intercepts before the page loads, and no content is rendered from x.com.
- **User enters a malformed instance host** → v1 can accept the raw string; options-page validation is a candidate refinement, noted as an open question.

## Open Questions

- Should the options page validate the instance host (strip scheme/trailing slash, reject empty)? Leaning yes but minimal.
- Should the toolbar icon do anything (e.g. quick enable/disable toggle), or is options-only enough for v1?
