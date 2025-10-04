import { z } from 'zod';

export const PostSchema = z.object({
  user: z.string(),
  text: z.string(),
  imageUrl: z.string().optional().default(''),
});

export type PostInput = z.infer<typeof PostSchema>;
