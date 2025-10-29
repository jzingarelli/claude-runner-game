/**
 * AWS S3 Service
 * Handles file uploads and management with S3
 */

import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { FileMetadata } from '../types';
import logger from '../utils/logger';
import crypto from 'crypto';
import path from 'path';

/**
 * S3 Service class
 */
class S3Service {
  private client: S3Client;
  private bucket: string;

  constructor() {
    this.client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
    this.bucket = process.env.AWS_S3_BUCKET || 'social-analytics-uploads';
  }

  /**
   * Generate unique file key
   */
  private generateFileKey(originalName: string, userId: string): string {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString('hex');
    const extension = path.extname(originalName);
    const baseName = path.basename(originalName, extension);
    const sanitizedName = baseName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    
    return `uploads/${userId}/${timestamp}-${randomString}-${sanitizedName}${extension}`;
  }

  /**
   * Upload file to S3
   * @param file - File buffer
   * @param originalName - Original filename
   * @param mimetype - File MIME type
   * @param userId - User ID for organizing files
   * @returns File metadata
   */
  async uploadFile(
    file: Buffer,
    originalName: string,
    mimetype: string,
    userId: string
  ): Promise<FileMetadata> {
    try {
      const key = this.generateFileKey(originalName, userId);

      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file,
        ContentType: mimetype,
        ACL: 'private', // Files are private by default
      });

      await this.client.send(command);

      const url = `${process.env.AWS_S3_PUBLIC_URL}/${key}`;

      logger.info(`File uploaded to S3: ${key}`);

      return {
        originalName,
        filename: path.basename(key),
        mimetype,
        size: file.length,
        url,
        key,
      };
    } catch (error) {
      logger.error('S3 upload failed:', error);
      throw new Error('Failed to upload file');
    }
  }

  /**
   * Delete file from S3
   * @param key - S3 object key
   */
  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.client.send(command);
      logger.info(`File deleted from S3: ${key}`);
    } catch (error) {
      logger.error('S3 delete failed:', error);
      throw new Error('Failed to delete file');
    }
  }

  /**
   * Get signed URL for private file access
   * @param key - S3 object key
   * @param expiresIn - URL expiration time in seconds (default: 1 hour)
   * @returns Signed URL
   */
  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      const url = await getSignedUrl(this.client, command, { expiresIn });
      return url;
    } catch (error) {
      logger.error('Failed to generate signed URL:', error);
      throw new Error('Failed to generate signed URL');
    }
  }

  /**
   * Upload multiple files
   * @param files - Array of files to upload
   * @param userId - User ID
   * @returns Array of file metadata
   */
  async uploadMultipleFiles(
    files: Array<{ buffer: Buffer; originalName: string; mimetype: string }>,
    userId: string
  ): Promise<FileMetadata[]> {
    const uploadPromises = files.map((file) =>
      this.uploadFile(file.buffer, file.originalName, file.mimetype, userId)
    );

    return Promise.all(uploadPromises);
  }

  /**
   * Validate file type
   * @param mimetype - File MIME type
   * @returns Boolean indicating if file type is allowed
   */
  validateFileType(mimetype: string): boolean {
    const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,application/pdf').split(',');
    return allowedTypes.includes(mimetype);
  }

  /**
   * Validate file size
   * @param size - File size in bytes
   * @returns Boolean indicating if file size is allowed
   */
  validateFileSize(size: number): boolean {
    const maxSize = parseInt(process.env.MAX_FILE_SIZE || '10485760'); // 10MB default
    return size <= maxSize;
  }
}

export default new S3Service();
