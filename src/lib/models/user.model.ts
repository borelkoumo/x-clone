import { IUser } from '@/types/user';
import { Schema, models, model } from 'mongoose';

const UserSchema = new Schema<IUser>(
  {
    clerkId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    email: { type: String, required: false },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    avatar: { type: String, required: true },
    followers: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    following: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
  },
  { timestamps: true },
);

const UserModel = models.User || model('User', UserSchema);

export default UserModel;
