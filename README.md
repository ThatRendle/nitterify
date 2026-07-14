<p align="center">
  <img src="icons/icon-128.png" alt="nitterify" width="96" height="96" />
</p>

<h1 align="center">nitterify</h1>

<p align="center">
  A tiny browser extension that quietly sends <strong>x.com</strong> links to
  <a href="https://github.com/zedeus/nitter">Nitter</a> instead.
</p>

---

Did you, like me, quit Twitter when it stopped being Twitter and slid even
further into whatever hellish swampitude it slid into?

Do you, like me, have friends who have heroically persisted in the face of
more horribleness than anyone should have to deal with?

Do they occasionally paste links to statuses or articles? Do you absent-mindedly
click those links and then recoil in horror as The Website That Might As Well
Be Truth f-ing Social™ loads in your browser?

This extension is for you. Well, it's for me, but you can use it if you like.

You click a link to a tweet — from Slack, Signal, WhatsApp, a search result,
wherever — and instead of landing on x.com, you land on a clean, login-free
[Nitter](https://github.com/zedeus/nitter) mirror. That's it. That's the whole
thing. No profile/search/timeline redirects, no other services, no in-page
link rewriting, no tracking, no options soup. Just tweets and articles,
redirected before x.com ever loads.

It defaults to [xcancel.com](https://xcancel.com) but you can point it at a
different Nitter host if you like.

I made it because the one extension that used to do this
([Privacy Redirect](https://github.com/SimonBrazell/privacy-redirect)) has been
unmaintained since 2021 and was more complicated than I needed.

If you like this extension and you use it with XCancel, please consider
donating to that project. [More details here.](https://xcancel.com/about)

## What gets redirected

| You click… | You get… |
| --- | --- |
| `x.com/{user}/status/{id}` (and `/photo/N`) | `<instance>/{user}/status/{id}` |
| `x.com/i/web/status/{id}` | `<instance>/i/web/status/{id}` |
| `x.com/i/article/{id}` | `<instance>/i/article/{id}` |
| anything else on x.com | left alone |

`twitter.com` links are handled the same way. The query string is stripped on
redirect, so X's `?s=…&t=…` share-tracking tags are dropped for free.

By default the target instance is [**xcancel.com**](https://xcancel.com), but you
can point it anywhere — including your own self-hosted Nitter — from the options
page.

## Install

nitterify runs on any Chromium browser (**Microsoft Edge** and **Google
Chrome**). It isn't in the extension stores yet, so for now you load it
unpacked:

1. Download **`nitterify.zip`** from the
   [latest release](https://github.com/ThatRendle/nitterify/releases/latest).
2. Unzip it somewhere you'll keep it (the browser loads it from this folder, so
   don't delete it afterwards).
3. Open your extensions page:
   - Edge: `edge://extensions`
   - Chrome: `chrome://extensions`
4. Turn on **Developer mode** (top-right toggle).
5. Click **Load unpacked** and select the unzipped folder.

That's it. Click a tweet link and you'll land on Nitter.

> **Note:** unpacked extensions don't auto-update, and the browser may
> occasionally remind you that developer-mode extensions are installed. To
> update, download the newer release zip and reload the extension.

## Configure your instance

Click nitterify's **Details → Extension options** (or right-click the toolbar
icon → **Options**) and enter the host of the Nitter instance you want:

- Leave it as `xcancel.com` (the default), **or**
- Enter your own, e.g. `nitter.example.com`.

Just the host — no `https://`, no trailing slash (it'll tidy up whatever you
paste). Changes take effect immediately, no restart needed.

## Why only statuses and articles?

Nitter mirrors Twitter's URL scheme cleanly for **tweets and articles**, but
many x.com paths (`/home`, `/explore`, search, bare profiles) either have no
Nitter equivalent or work unreliably since Twitter locked down its API. Rather
than send you to broken pages, nitterify deliberately only redirects the paths
that actually work. Tweets are the overwhelming majority of links you click
anyway.

Also worth knowing: public Nitter instances can come and go. `xcancel.com` is a
healthy one today, but if it ever goes dark, just point nitterify at another
instance (or your own) in the options.

## Privacy

nitterify collects **nothing**. It has no servers, no analytics, no network
calls of its own. The only thing it stores is the instance host you choose, kept
in your browser's synced extension storage. Redirection is handled natively by
the browser's `declarativeNetRequest` engine — the extension never reads the
contents of any page.

## Build from source

```bash
npm install
npm run dev       # Vite dev build with hot reload
npm run build     # typecheck + production build into dist/
npm test          # unit tests for the redirect + normalization logic
npm run package   # build and produce a release-ready nitterify.zip
```

Then load the `dist/` folder unpacked, as above.

Built with vanilla TypeScript + [Vite](https://vite.dev) and
[@crxjs/vite-plugin](https://crxjs.dev). The redirect logic lives in
[`src/rules.ts`](src/rules.ts); the service worker that keeps the rules in sync
with your chosen instance is [`src/background.ts`](src/background.ts).

## License

MIT
