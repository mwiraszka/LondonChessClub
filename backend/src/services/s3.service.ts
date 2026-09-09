import { S3Client } from '@aws-sdk/client-s3';

const {
  AWS_S3_BUCKET_NAME,
  AWS_S3_BUCKET_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_USER_SECRET_ACCESS_KEY,
} = process.env;

if (
  !AWS_S3_BUCKET_NAME ||
  !AWS_S3_BUCKET_REGION ||
  !AWS_ACCESS_KEY_ID ||
  !AWS_USER_SECRET_ACCESS_KEY
) {
  throw new Error('Unable to parse AWS environment variables.');
}

export const s3Client = new S3Client({
  region: AWS_S3_BUCKET_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_USER_SECRET_ACCESS_KEY,
  },
  requestHandler: {
    requestTimeout: 60000,
  },
});
