import { z } from 'zod';

export const TypeCheckRequestSchema = z.object({
  code: z.string().min(1, 'コードを入力してください'),
});

export const TypeCheckResponseSchema = z.object({
  success: z.boolean(),
  result: z.string(),
});

export type TypeCheckRequest = z.infer<typeof TypeCheckRequestSchema>;
export type TypeCheckResponse = z.infer<typeof TypeCheckResponseSchema>; 