import { Request, Response } from 'express';
import { Webhook } from 'svix';

import { ApiResponse } from '../models/api-response.model';
import { UserModel } from '../models/user.model';
import { deleteAvatar, uploadAvatar } from '../services/avatar-storage.service';
import { ClerkProfile, ensureUser } from '../services/users.service';

const { CLERK_WEBHOOK_SECRET } = process.env;
if (!CLERK_WEBHOOK_SECRET) {
  throw new Error('Unable to parse Clerk webhook environment variables.');
}

const webhook = new Webhook(CLERK_WEBHOOK_SECRET);

interface ClerkEmailAddress {
  id: string;
  email_address: string;
}

export interface ClerkUserEventData {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  email_addresses?: ClerkEmailAddress[];
  primary_email_address_id?: string | null;
  image_url?: string;
  has_image?: boolean;
  public_metadata?: Record<string, unknown>;
}

interface ClerkUserEvent {
  type: string;
  data: ClerkUserEventData;
}

export function toProfile(data: ClerkUserEventData): ClerkProfile {
  const primaryEmail =
    data.email_addresses?.find(address => address.id === data.primary_email_address_id) ??
    data.email_addresses?.[0];

  return {
    id: data.id,
    email: primaryEmail?.email_address ?? '',
    firstName: data.first_name ?? '',
    lastName: data.last_name ?? '',
    imageUrl: data.image_url ?? '',
    hasImage: data.has_image ?? false,
    isAdmin: data.public_metadata?.['isAdmin'] === true,
  };
}

async function handleUserUpdated(profile: ClerkProfile): Promise<void> {
  const user = (await UserModel.findOne({ id: profile.id }))?.toObject();
  if (!user) {
    await ensureUser(profile);
    return;
  }

  const clerkImageUrl = profile.hasImage ? profile.imageUrl : null;
  const imageChanged = clerkImageUrl !== user.clerkImageUrl;

  const profileFields = {
    email: profile.email,
    firstName: profile.firstName,
    lastName: profile.lastName,
    isAdmin: profile.isAdmin,
    clerkImageUrl,
  };

  if (imageChanged && profile.hasImage && !user.avatarManagedByApp) {
    // Avatar was set via the Clerk dashboard (not the app), so sync it to R2
    try {
      const response = await fetch(profile.imageUrl);
      const buffer = await response.arrayBuffer();
      const contentType = response.headers.get('content-type') || 'image/jpeg';
      const url = await uploadAvatar(profile.id, buffer, contentType);

      await UserModel.updateOne(
        { id: profile.id },
        {
          $set: {
            ...profileFields,
            avatarUrl: url,
            avatarOriginalUrl: url,
            avatarCropState: { zoom: 1, offsetX: 0, offsetY: 0 },
          },
        },
      );
    } catch {
      await UserModel.updateOne({ id: profile.id }, { $set: profileFields });
    }
  } else if (imageChanged && !profile.hasImage) {
    try {
      await deleteAvatar(profile.id);
    } catch {
      // avatar may not exist in R2
    }

    await UserModel.updateOne(
      { id: profile.id },
      {
        $set: {
          ...profileFields,
          avatarUrl: null,
          avatarOriginalUrl: null,
          avatarCropState: null,
          avatarManagedByApp: false,
        },
      },
    );
  } else {
    await UserModel.updateOne({ id: profile.id }, { $set: profileFields });
  }
}

export async function handleClerkWebhook(
  req: Request,
  res: Response<ApiResponse<'success'>>,
): Promise<void> {
  const svixId = req.header('svix-id');
  const svixTimestamp = req.header('svix-timestamp');
  const svixSignature = req.header('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature) {
    res.status(400).json({ message: 'Missing webhook signature headers.' });
    return;
  }

  const payload = (req.body as Buffer).toString('utf8');
  try {
    webhook.verify(payload, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    });
  } catch {
    res.status(400).json({ message: 'Invalid webhook signature.' });
    return;
  }

  const event = JSON.parse(payload) as ClerkUserEvent;

  try {
    if (event.type === 'user.created') {
      await ensureUser(toProfile(event.data));
    } else if (event.type === 'user.updated') {
      await handleUserUpdated(toProfile(event.data));
    } else if (event.type === 'user.deleted') {
      try {
        await deleteAvatar(event.data.id);
      } catch {
        // avatar may not exist in R2
      }
      await UserModel.deleteOne({ id: event.data.id });
    }

    res.status(200).json({ data: 'success' });
  } catch (error) {
    res.status(500).json({ message: `Unable to process webhook event: ${error}` });
  }
}
