import { describe, it, expect, afterEach, vi } from 'vitest';
import { getCsrfToken } from './csrf';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('getCsrfToken', () => {
  it('returns token when cookie exists', () => {
    vi.stubGlobal('document', { cookie: 'foo=bar; csrf-token=test; bar=baz' });
    expect(getCsrfToken()).toBe('test');
  });

  it('returns null when token is missing', () => {
    vi.stubGlobal('document', { cookie: 'foo=bar' });
    expect(getCsrfToken()).toBeNull();
  });

  it('returns null when document is undefined', () => {
    vi.stubGlobal('document', undefined);
    expect(getCsrfToken()).toBeNull();
  });
});
