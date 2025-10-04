import PostModel from '@/lib/models/post.model';
import { connect } from '@/lib/mongodb/mongoose';

// Assure que le modèle "User" est enregistré avant d'appeler populate()
import '@/lib/models/user.model';
import { PostInput } from '../validation/post.schema';
import { IPost } from '@/types/post';

export async function createPost(input: PostInput): Promise<IPost> {
  await connect();

  const inserted = await PostModel.create(input);
  return inserted;
}

export async function getPosts(): Promise<IPost[]> {
  await connect();

  const posts = await PostModel.find()
    .populate('user', 'firstName lastName username avatar')
    .sort({ createdAt: -1 })
    .lean();
  
  return (JSON.parse(JSON.stringify(posts)) as IPost[]);

  // Map posts to ensure they conform to IPost type
  // Convertir ObjectId et Date en string pour Next.js
  // return posts.map(p => ({
  //   _id: (p._id as any).toString(),
  //   text: p.text,
  //   imageUrl: p.imageUrl || '',
  //   user: {
  //     _id: (p.user as any)._id.toString(),
  //     username: (p.user as any).username,
  //     avatar: (p.user as any).avatar,
  //   },
  //   createdAt: p.createdAt.toISOString(),
  //   updatedAt: p.updatedAt.toISOString(),
  // })) as IPost[];
}
