import { Schema, model } from 'mongoose';

import { Id } from './core.model';

export interface User {
  id: Id; // Cognito user 'username' or 'sub' property
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  refreshToken: string | null;
}

const userSchema = new Schema<User>(
  {
    id: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    isAdmin: { type: Boolean, required: true },
    refreshToken: { type: String },
  },
  { versionKey: false },
);

export const UserModel = model<User>('User', userSchema);

export type ClientUser = Omit<User, 'refreshToken'>;
