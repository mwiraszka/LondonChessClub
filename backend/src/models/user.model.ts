import { Schema, model } from 'mongoose';

import { Id } from './core.model';

export interface AvatarCropState {
  zoom: number;
  offsetX: number;
  offsetY: number;
}

export interface User {
  id: Id; // Clerk user id
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  clerkImageUrl: string | null;
  avatarUrl: string | null;
  avatarOriginalUrl: string | null;
  avatarManagedByApp: boolean;
  avatarCropState: AvatarCropState | null;
}

const userSchema = new Schema<User>(
  {
    id: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    isAdmin: { type: Boolean, required: true },
    clerkImageUrl: { type: String, default: null },
    avatarUrl: { type: String, default: null },
    avatarOriginalUrl: { type: String, default: null },
    avatarManagedByApp: { type: Boolean, default: false },
    avatarCropState: {
      type: { zoom: Number, offsetX: Number, offsetY: Number },
      default: null,
      _id: false,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: 'createdDate', updatedAt: 'lastModifiedDate' },
  },
);

export const UserModel = model<User>('User', userSchema);
