import { describe, it, expect } from 'vitest';
import { config } from './middleware';

describe('middleware config', () => {
  it('includes pages in matcher', () => {
    expect(config.matcher).toEqual(
      expect.arrayContaining(['/play', '/result'])
    );
  });
});
