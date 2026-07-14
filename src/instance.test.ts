import { describe, it, expect } from 'vitest';
import { normalizeInstance, DEFAULT_INSTANCE } from './instance';

describe('normalizeInstance', () => {
  it('passes a bare host through', () => {
    expect(normalizeInstance('xcancel.com')).toBe('xcancel.com');
  });

  it('trims surrounding whitespace', () => {
    expect(normalizeInstance('  xcancel.com  ')).toBe('xcancel.com');
  });

  it('strips an https scheme', () => {
    expect(normalizeInstance('https://nitter.example.com')).toBe('nitter.example.com');
  });

  it('strips an http scheme', () => {
    expect(normalizeInstance('http://nitter.example.com')).toBe('nitter.example.com');
  });

  it('strips a trailing slash and path', () => {
    expect(normalizeInstance('https://nitter.example.com/')).toBe('nitter.example.com');
    expect(normalizeInstance('nitter.example.com/some/path')).toBe('nitter.example.com');
  });

  it('falls back to the default when empty', () => {
    expect(normalizeInstance('')).toBe(DEFAULT_INSTANCE);
    expect(normalizeInstance('   ')).toBe(DEFAULT_INSTANCE);
    expect(normalizeInstance('https://')).toBe(DEFAULT_INSTANCE);
  });
});
