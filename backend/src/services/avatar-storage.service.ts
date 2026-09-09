import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

export type AvatarVariant = 'original' | 'cropped';

// Resolved lazily so the app can boot (and non-avatar features work) before the
// R2 credentials are configured.
function createClient(): S3Client {
  const { R2_ACCOUNT_ID, R2_AVATARS_ACCESS_KEY_ID, R2_AVATARS_SECRET_ACCESS_KEY } =
    process.env;
  if (!R2_ACCOUNT_ID || !R2_AVATARS_ACCESS_KEY_ID || !R2_AVATARS_SECRET_ACCESS_KEY) {
    throw new Error('Unable to parse R2 environment variables.');
  }

  return new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_AVATARS_ACCESS_KEY_ID,
      secretAccessKey: R2_AVATARS_SECRET_ACCESS_KEY,
    },
  });
}

export function avatarPublicUrlPrefix(): string {
  const { R2_AVATARS_PUBLIC_URL } = process.env;
  if (!R2_AVATARS_PUBLIC_URL) {
    throw new Error('Unable to parse R2 environment variables.');
  }
  return R2_AVATARS_PUBLIC_URL;
}

function avatarKey(userId: string, variant: AvatarVariant): string {
  return `avatars/${userId}/${variant}`;
}

export async function uploadAvatar(
  userId: string,
  file: Buffer | ArrayBuffer,
  contentType: string,
  variant: AvatarVariant = 'original',
): Promise<string> {
  const s3 = createClient();
  const key = avatarKey(userId, variant);

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env['R2_AVATARS_BUCKET_NAME'],
      Key: key,
      Body: file instanceof Buffer ? file : new Uint8Array(file),
      ContentType: contentType,
    }),
  );

  return `${avatarPublicUrlPrefix()}/${key}`;
}

export async function deleteAvatar(userId: string): Promise<void> {
  const s3 = createClient();

  await Promise.all(
    (['original', 'cropped'] as const).map(variant =>
      s3.send(
        new DeleteObjectCommand({
          Bucket: process.env['R2_AVATARS_BUCKET_NAME'],
          Key: avatarKey(userId, variant),
        }),
      ),
    ),
  );
}
