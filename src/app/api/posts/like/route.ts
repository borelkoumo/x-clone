import { likePost } from '@/lib/actions/posts';
import LikeSchema from '@/lib/validation/like.schema';
import { currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import z from 'zod';

export async function PUT(req: NextRequest) {
  try {
    const user = await currentUser();
    const body = await req.json();

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userMongoId = user.publicMetadata.userMongoId as string;

    const parsedBody = LikeSchema.parse({
      postId: body.postId,
    });

    const liked = await likePost(parsedBody.postId, userMongoId);

    return NextResponse.json({
      message: `Post ${liked ? 'liked' : 'unliked'} successfully`,
      liked,
    });
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: 'Invalid request',
          errors: z.treeifyError(error).errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        message: 'Internal server error:' + (error as any).message,
      },
      { status: 500 },
    );
  }
}
