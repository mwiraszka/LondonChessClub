import { User, UserModel } from '../models/user.model';
import { uploadAvatar } from './avatar-storage.service';

export interface ClerkProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  hasImage: boolean;
  isAdmin: boolean;
}

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    (error as { code?: number }).code === 11000
  );
}

// Creates the user document for a Clerk account unless it already exists,
// returning the document either way. Both the user.created webhook and the auth
// middleware's lazy path call this and may race; the unique index on `id`
// settles the race atomically, and only the call that actually inserted the
// document runs the one-time R2 avatar copy.
export async function ensureUser(profile: ClerkProfile): Promise<User | null> {
  const existing = await UserModel.findOne({ id: profile.id });
  if (existing) {
    return existing.toObject();
  }

  const user: User = {
    id: profile.id,
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    isAdmin: profile.isAdmin,
    // Without a photo, Clerk reports a placeholder imageUrl; store null so it
    // is never mistaken for a real avatar
    clerkImageUrl: profile.hasImage ? profile.imageUrl : null,
    avatarUrl: null,
    avatarOriginalUrl: null,
    avatarManagedByApp: false,
    avatarCropState: null,
  };

  try {
    await UserModel.create(user);
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return (await UserModel.findOne({ id: profile.id }))?.toObject() ?? null;
    }
    throw error;
  }

  // Copy the photo into the app's own R2 bucket so the avatar editor has a
  // CORS-clean source to load.
  if (profile.hasImage) {
    try {
      const response = await fetch(profile.imageUrl);
      const buffer = await response.arrayBuffer();
      const contentType = response.headers.get('content-type') || 'image/jpeg';
      const url = await uploadAvatar(profile.id, buffer, contentType);
      await UserModel.updateOne(
        { id: profile.id },
        { $set: { avatarUrl: url, avatarOriginalUrl: url } },
      );
    } catch {
      // account still works without the R2 avatar
    }
  }

  return (await UserModel.findOne({ id: profile.id }))?.toObject() ?? null;
}
