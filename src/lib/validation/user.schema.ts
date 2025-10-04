import { z } from 'zod';

export const UserSchema = z.object({
  clerkId: z.string(),
  username: z.string(),
  email: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  avatar: z.string(),
  followers: z.array(z.string()).optional().default([]),
  following: z.array(z.string()).optional().default([]),
});

export type UserInput = z.infer<typeof UserSchema>;
