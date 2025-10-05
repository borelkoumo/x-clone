import { z } from 'zod';

const LikeSchema = z.object({
  postId: z.string('Post ID required'),
});

export default LikeSchema;
