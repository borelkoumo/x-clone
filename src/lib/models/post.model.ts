import { IPost } from '@/types/post';
import { Schema, model, models } from 'mongoose';

const PostSchema = new Schema<IPost>(
  {
    user: {
      type: Schema.Types.Mixed, // Accepts both ObjectId and String
      ref: 'User',
      required: true,
    },
    text: { type: String, required: true },
    imageUrl: { type: String, required: false },
    likes: { type: [String], default: [] },
  },
  { timestamps: true },
);

const PostModel = models.Post || model('Post', PostSchema);

export default PostModel;
