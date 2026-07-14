import { describe, it, expect } from 'vitest';
import { buildRules, STATUS_REGEX, ARTICLE_REGEX } from './rules';

// Reproduce what the DNR engine does with a regexSubstitution rule: match the
// whole URL, replace it with the substitution, expanding \1 to capture group 1.
function applyRule(regexFilter: string, substitution: string, url: string): string | null {
  const match = new RegExp(regexFilter).exec(url);
  if (!match) return null;
  return substitution.replace(/\\(\d)/g, (_, n: string) => match[Number(n)] ?? '');
}

function redirect(url: string): string | null {
  const sub = 'https://xcancel.com/\\1';
  return applyRule(STATUS_REGEX, sub, url) ?? applyRule(ARTICLE_REGEX, sub, url);
}

describe('buildRules', () => {
  it('produces two stable-id main_frame redirect rules', () => {
    const rules = buildRules('xcancel.com');
    expect(rules.map((r) => r.id)).toEqual([1, 2]);
    for (const rule of rules) {
      expect(rule.action.type).toBe('redirect');
      expect(rule.action.redirect?.regexSubstitution).toBe('https://xcancel.com/\\1');
      expect(rule.condition.resourceTypes).toEqual(['main_frame']);
    }
  });

  it('targets a custom instance host', () => {
    const rules = buildRules('nitter.example.com');
    expect(rules[0].action.redirect?.regexSubstitution).toBe('https://nitter.example.com/\\1');
  });
});

describe('redirect behaviour', () => {
  it('redirects a tweet permalink', () => {
    expect(redirect('https://x.com/jack/status/20')).toBe('https://xcancel.com/jack/status/20');
  });

  it('redirects twitter.com too', () => {
    expect(redirect('https://twitter.com/jack/status/20')).toBe(
      'https://xcancel.com/jack/status/20',
    );
  });

  it('redirects http as well as https', () => {
    expect(redirect('http://x.com/jack/status/20')).toBe('https://xcancel.com/jack/status/20');
  });

  it('preserves media subpaths', () => {
    expect(redirect('https://x.com/jack/status/20/photo/1')).toBe(
      'https://xcancel.com/jack/status/20/photo/1',
    );
  });

  it('redirects handle-less status links', () => {
    expect(redirect('https://x.com/i/web/status/20')).toBe('https://xcancel.com/i/web/status/20');
  });

  it('redirects article permalinks', () => {
    expect(redirect('https://x.com/i/article/2075361336381555096')).toBe(
      'https://xcancel.com/i/article/2075361336381555096',
    );
  });

  it('strips the query string (and tracking params)', () => {
    expect(redirect('https://x.com/jack/status/20?s=46&t=abc123')).toBe(
      'https://xcancel.com/jack/status/20',
    );
  });

  it('leaves the home timeline untouched', () => {
    expect(redirect('https://x.com/home')).toBeNull();
  });

  it('leaves bare profiles untouched', () => {
    expect(redirect('https://x.com/jack')).toBeNull();
  });

  it('leaves reserved routes untouched', () => {
    expect(redirect('https://x.com/explore')).toBeNull();
    expect(redirect('https://x.com/settings')).toBeNull();
  });
});
