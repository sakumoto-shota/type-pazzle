import handler from './typecheck';
import { describe, it, expect, vi } from 'vitest';
import type { NextApiRequest, NextApiResponse } from 'next';

const createMockReqRes = (code: string) => {
  const req = {
    method: 'POST',
    body: { code },
    headers: { 'x-csrf-token': 'token' },
    cookies: { 'csrf-token': 'token' },
  } as unknown as NextApiRequest;

  const json = vi.fn();
  const status = vi.fn(() => ({ json }));
  const res = { status } as unknown as NextApiResponse;
  return { req, res, json, status };
};

describe('typecheck API', () => {
  it('rejects code containing any', async () => {
    const { req, res, json, status } = createMockReqRes('type Foo = any');
    await handler(req, res);
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ error: 'anyは使用できません' });
  });
});
