import { createPost, deletePost, getPost, getPosts } from '@/lib/actions/posts';
import PostModel from '@/lib/models/post.model';
import { PostSchema } from '@/lib/validation/post.schema';
import { currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import z from 'zod';

const GetPostSchema = z.object({
  postId: z.string('Post ID required'),
});

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const postId = req.nextUrl.pathname.split('/').pop();
    const parsedBody = GetPostSchema.parse({
      postId,
    });

    const post = await getPost(parsedBody.postId);

    console.log('post', post);

    return NextResponse.json({ post }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: 'Unable to get post' + (error.message as string) },
      { status: 500 },
    );
  }
}
