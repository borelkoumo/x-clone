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

  // return (JSON.parse(JSON.stringify(posts)) as IPost[]);

  // Map posts to ensure they conform to IPost type
  // Convert ObjectId and Date to string for Next.js
  return posts.map(p => ({
    _id: (p._id as any).toString(),
    text: p.text,
    imageUrl: p.imageUrl || '',
    user: p.user
      ? {
          _id: (p.user as any)._id.toString(),
          firstName: (p.user as any).firstName,
          lastName: (p.user as any).lastName,
          username: (p.user as any).username,
          avatar: (p.user as any).avatar,
        }
      : undefined,
    createdAt:
      p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
    updatedAt:
      p.updatedAt instanceof Date ? p.updatedAt.toISOString() : p.updatedAt,
    likes: Array.isArray(p.likes)
      ? p.likes.map((id: any) => id.toString())
      : [],
  })) as IPost[];
}

export async function getPost(postId: string): Promise<IPost | null> {
  await connect();

  const post = await PostModel.findById<IPost>(postId).populate('user');

  if (!post) {
    return null;
  }

  // Convert ObjectId and Date to string for Next.js
  return {
    _id: (post._id as any).toString(),
    text: post.text,
    imageUrl: post.imageUrl || '',
    user: post.user
      ? {
          _id: (post.user as any)._id.toString(),
          firstName: (post.user as any).firstName,
          lastName: (post.user as any).lastName,
          username: (post.user as any).username,
          avatar: (post.user as any).avatar,
        }
      : undefined,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    likes: Array.isArray(post.likes)
      ? post.likes.map((id: any) => id.toString())
      : [],
  } as IPost;
}

export async function likePost(postId: string, userMongoId: string) {
  await connect();

  const post = await PostModel.findById(postId);

  if (!post) {
    throw new Error('Post not found');
  }

  // Initialize likes array if it doesn't exist
  if (!post.likes) {
    post.likes = [];
  }

  console.log('post', post);
  const hasLiked = post.likes.includes(userMongoId);

  if (hasLiked) {
    // Unlike: remove user ID from likes array
    await PostModel.findByIdAndUpdate(
      postId,
      { $pull: { likes: userMongoId } },
      { new: true },
    );
  } else {
    // Like: add user ID to likes array
    await PostModel.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: userMongoId } },
      { new: true },
    );
  }

  return !hasLiked;
}
