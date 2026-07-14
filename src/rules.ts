// declarativeNetRequest redirect rules.
//
// Both filters anchor the whole URL (^...$) so the entire URL — including any
// query string — is consumed by the match and therefore replaced. Capture
// group 1 holds the path only ([^?#]* stops before ?/#), so the substitution
// emits the path without the query, stripping X's ?s=/&t= tracking cruft.
//
// The engine is RE2 (no lookahead), but these paths contain a distinguishing
// keyword segment (/status/, i/article/) so they can never collide with x.com's
// reserved words (/home, /explore, ...). No allow-rule exclusions needed.

/** Matches tweet permalinks: /{user}/status/{id}[/...] and /i/web/status/{id}. */
export const STATUS_REGEX = '^https?://(?:x|twitter)\\.com/(.+/status/[^?#]*).*$';

/** Matches article permalinks: /i/article/{id}. */
export const ARTICLE_REGEX = '^https?://(?:x|twitter)\\.com/(i/article/[^?#]*).*$';

/**
 * Build the dynamic redirect rules targeting `instance` (a bare host such as
 * "xcancel.com"). Rule ids are stable so they can be replaced on each rebuild.
 */
export function buildRules(instance: string): chrome.declarativeNetRequest.Rule[] {
  const substitution = `https://${instance}/\\1`;
  const make = (id: number, regexFilter: string) => ({
    id,
    priority: 1,
    action: {
      type: 'redirect',
      redirect: { regexSubstitution: substitution },
    },
    condition: {
      regexFilter,
      // Only top-level navigations — never embedded widgets or API sub-requests.
      resourceTypes: ['main_frame'],
    },
  });
  return [
    make(1, STATUS_REGEX),
    make(2, ARTICLE_REGEX),
  ] as chrome.declarativeNetRequest.Rule[];
}
