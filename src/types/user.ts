import { Types } from "mongoose";

export interface IUser {
  _id: string; // généré par MongoDB
  clerkId: string;
  username: string;
  email?: string;
  firstName: string;
  lastName: string;
  avatar: string;
  followers?: Types.ObjectId[] | string[] | IUser[];
  following?: Types.ObjectId[] | string[] | IUser[];
  createdAt: Date; // ajouté par timestamps
  updatedAt: Date; // ajouté par timestamps
}