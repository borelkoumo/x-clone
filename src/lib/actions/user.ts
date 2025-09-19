import User, { UserType } from '@/lib/models/user.model';
import { connect } from '../mongodb/mongoose';

export async function createOrUpdateUser(user: UserType) {
  await connect();
  const result = await User.findOneAndUpdate(
    { clerkId: user.clerkId },
    { $set: user },
    { new: true, upsert: true },
  );
  return result;
}

export async function deleteUser(id: string | undefined) {
  await connect();
  if (id) {
    await User.deleteOne({ clerkId: id });
  }
}
