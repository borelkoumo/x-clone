import { createOrUpdateUser, deleteUser } from '@/lib/actions/user';
import { UserSchema } from '@/lib/validation/user.schema';
import { clerkClient } from '@clerk/nextjs/server';
import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    switch (evt.type) {
      case 'user.created':
      case 'user.updated':
        const parsedBody = UserSchema.parse({
          clerkId: evt.data.id,
          username: evt.data.username ?? '',
          email: evt.data.email_addresses?.[0]?.email_address ?? '',
          firstName: evt.data.first_name ?? '',
          lastName: evt.data.last_name ?? '',
          avatar: evt.data.image_url ?? '',
        });
        try {
          const updatedUser = await createOrUpdateUser(parsedBody);

          if (updatedUser && evt.type === 'user.created') {
            (await clerkClient()).users.updateUserMetadata(parsedBody.clerkId, {
              publicMetadata: {
                userMongoId: updatedUser._id,
              },
            });
          }

          console.log('Updated', updatedUser);
          return new Response('OK', { status: 200 });
        } catch (error: any) {
          console.log(error.message);
          return new Response(error.message, { status: 400 });
        }

      case 'user.deleted':
        const clerkId = evt.data.id;
        try {
          await deleteUser(clerkId);
          return new Response('OK', { status: 200 });
        } catch (error: any) {
          return new Response(error.message, { status: 400 });
        }

      default:
        return new Response('OK', { status: 200 });
        break;
    }
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook', { status: 400 });
  }
}
