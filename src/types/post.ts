import { Types } from 'mongoose';
import { IUser } from './user';

export type IPost = (
  | {
      _id: string; // généré par MongoDB
      user: Types.ObjectId;
    }
  | {
      _id: string; // généré par MongoDB
      user: string;
    }
  | {
      _id: string; // généré par MongoDB
      user: IUser;
    }
) & {
  text: string;
  imageUrl?: string;
  createdAt: string; // ajouté par timestamps
  updatedAt: string; // ajouté par timestamps
};
