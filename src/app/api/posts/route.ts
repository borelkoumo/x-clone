import { createPost, getPosts } from '@/lib/actions/posts';
import { PostSchema } from '@/lib/validation/post.schema';
import { currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // validation Zod (ajoute sécurité côté API)
  const parsedBody = PostSchema.parse({
    user: body.userMongoId,
    text: body.text,
    imageUrl: body.imageUrl,
  });

  console.log('body', body);
  console.log('parsedBody', parsedBody);

  if (user.publicMetadata.userMongoId !== parsedBody.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const newPost = await createPost(parsedBody);

    console.log('response', newPost);

    return NextResponse.json(
      { message: 'Post created', post: newPost },
      { status: 201 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'Unable to create post' },
      { status: 500 },
    );
  }
}

// export async function GET(req: NextRequest) {
//   const user = await currentUser();

//   if (!user) {
//     return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
//   }

//   try {
//     const response = await getPosts();

//     console.log('response', response);

//     return NextResponse.json({ posts: response });
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json(
//       { message: 'Unable to get all posts' },
//       { status: 500 },
//     );
//   }
// }
