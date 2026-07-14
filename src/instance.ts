/** Default Nitter instance used when the user has not configured one. */
export const DEFAULT_INSTANCE = 'xcancel.com';

/** Key under which the target instance host is stored in chrome.storage.sync. */
export const STORAGE_KEY = 'instance';

/**
 * Normalize a user-entered instance value to a bare host.
 *
 * Strips any scheme, path, and trailing slash so the value can be dropped
 * straight into `https://<host>/...`. Falls back to the default when the
 * result is empty.
 */
export function normalizeInstance(input: string): string {
  const host = input
    .trim()
    .replace(/^https?:\/\//i, '') // drop scheme
    .replace(/\/.*$/, ''); // drop path + trailing slash
  return host.length > 0 ? host : DEFAULT_INSTANCE;
}
