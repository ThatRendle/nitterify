import { defineManifest } from '@crxjs/vite-plugin';

export default defineManifest({
  manifest_version: 3,
  name: 'nitterify',
  version: '0.1.1',
  description:
    'Redirect x.com status and article links to a Nitter instance (default xcancel.com).',
  // WithHostAccess variant: same redirect capability, but no extra install-time
  // warning beyond the host permissions we already declare below.
  permissions: ['declarativeNetRequestWithHostAccess', 'storage'],
  host_permissions: ['*://x.com/*', '*://twitter.com/*'],
  background: {
    service_worker: 'src/background.ts',
    type: 'module',
  },
  options_ui: {
    page: 'src/options.html',
    open_in_tab: true,
  },
  action: {
    default_title: 'nitterify — redirecting x.com to Nitter',
  },
  icons: {
    16: 'icons/icon-16.png',
    32: 'icons/icon-32.png',
    48: 'icons/icon-48.png',
    128: 'icons/icon-128.png',
  },
});
