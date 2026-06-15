import { Client } from 'minio';
import { v4 as uuidv4 } from 'uuid';

let client: Client | null = null;

function getClient(): Client {
  if (!client) {
    client = new Client({
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: parseInt(process.env.MINIO_PORT || '9000', 10),
      useSSL: false,
      accessKey: process.env.MINIO_ACCESS_KEY || 'necoll_minio',
      secretKey: process.env.MINIO_SECRET_KEY || 'necoll_minio_secret',
    });
  }
  return client;
}

const BUCKET = process.env.MINIO_BUCKET || 'necoll-uploads';
const PUBLIC_URL = process.env.MINIO_PUBLIC_URL || 'http://localhost:9000';

export class MinioService {
  async ensureBucket(): Promise<void> {
    const minio = getClient();
    const exists = await minio.bucketExists(BUCKET);
    if (!exists) {
      await minio.makeBucket(BUCKET);
      const policy = {
        Version: '2012-10-17',
        Statement: [{
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${BUCKET}/*`],
        }],
      };
      await minio.setBucketPolicy(BUCKET, JSON.stringify(policy));
    }
  }

  async upload(file: Express.Multer.File, folder = 'general'): Promise<string> {
    await this.ensureBucket();
    const minio = getClient();
    const ext = file.originalname.split('.').pop() || 'bin';
    const objectName = `${folder}/${uuidv4()}.${ext}`;

    await minio.putObject(BUCKET, objectName, file.buffer, file.size, {
      'Content-Type': file.mimetype,
    });

    return `/uploads/${objectName}`;
  }

  getPublicUrl(objectPath: string): string {
    if (objectPath.startsWith('/uploads/')) {
      return `${PUBLIC_URL}/${BUCKET}/${objectPath.replace('/uploads/', '')}`;
    }
    return objectPath;
  }
}

export const minioService = new MinioService();
