import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '../config/env';
import { nanoid } from 'nanoid';

export class FileService {
  private s3 = new S3Client({ region: env.AWS_REGION });

  async createPresignedUpload(contentType: string, extension = '') {
    const key = `uploads/${nanoid(24)}${extension ? '.' + extension : ''}`;
    const command = new PutObjectCommand({ Bucket: env.AWS_S3_BUCKET, Key: key, ContentType: contentType });
    const url = await getSignedUrl(this.s3, command, { expiresIn: 60 });
    return { url, key };
  }
}
