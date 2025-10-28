import { S3Client, PutObjectCommand, HeadBucketCommand, CreateBucketCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "node:crypto";

import { S3_ACCESS_KEY, S3_BUCKET, S3_ENDPOINT, S3_FORCE_PATH_STYLE, S3_REGION, S3_SECRET_KEY } from "./config";

export type PrepareFile = {
  clientId: string; // client-provided media ID
  checksum: string;
  size: number;
  mimeType: string;
};

export type PreparedUpload = {
  id: string; // server media id
  clientId: string; // echoes client media id
  uploadUrl: string;
  method: string;
  headers: Record<string, string>;
};

let s3: S3Client | null = null;

export const getS3 = () => {
  if (!s3) {
    s3 = new S3Client({
      region: S3_REGION,
      endpoint: S3_ENDPOINT,
      forcePathStyle: S3_FORCE_PATH_STYLE,
      credentials: {
        accessKeyId: S3_ACCESS_KEY!,
        secretAccessKey: S3_SECRET_KEY!
      }
    });
  }
  return s3;
};

export const ensureBucket = async () => {
  const client = getS3();
  try {
    await client.send(new HeadBucketCommand({ Bucket: S3_BUCKET }));
  } catch {
    await client.send(new CreateBucketCommand({ Bucket: S3_BUCKET }));
  }
};

export const prepareUploads = async (files: PrepareFile[]): Promise<PreparedUpload[]> => {
  await ensureBucket();
  const client = getS3();

  const uploads: PreparedUpload[] = [];

  for (const file of files) {
    const id = randomUUID();
    const key = `uploads/${id}`;
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      ContentType: file.mimeType,
      ContentMD5: undefined // optional
    });

    const uploadUrl = await getSignedUrl(client, command, { expiresIn: 60 * 10 }); // 10 minutes

    uploads.push({
      id,
      clientId: file.clientId,
      uploadUrl,
      method: "PUT",
      headers: { "Content-Type": file.mimeType }
    });
  }

  return uploads;
};
