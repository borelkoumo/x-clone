import UserModel from '@/lib/models/user.model';
import { connect } from '../mongodb/mongoose';
import { UserInput } from '../validation/user.schema';

export async function createOrUpdateUser(user: UserInput) {
  await connect();
  const result = await UserModel.findOneAndUpdate(
    { clerkId: user.clerkId },
    { $set: user },
    { new: true, upsert: true },
  );
  return result;
}

export async function deleteUser(id: string | undefined) {
  await connect();
  if (id) {
    await UserModel.deleteOne({ clerkId: id });
  }
}
