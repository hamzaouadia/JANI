"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareUploads = exports.ensureBucket = exports.getS3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const node_crypto_1 = require("node:crypto");
const config_1 = require("./config");
let s3 = null;
const getS3 = () => {
    if (!s3) {
        s3 = new client_s3_1.S3Client({
            region: config_1.S3_REGION,
            endpoint: config_1.S3_ENDPOINT,
            forcePathStyle: config_1.S3_FORCE_PATH_STYLE,
            credentials: {
                accessKeyId: config_1.S3_ACCESS_KEY,
                secretAccessKey: config_1.S3_SECRET_KEY
            }
        });
    }
    return s3;
};
exports.getS3 = getS3;
const ensureBucket = async () => {
    const client = (0, exports.getS3)();
    try {
        await client.send(new client_s3_1.HeadBucketCommand({ Bucket: config_1.S3_BUCKET }));
    }
    catch {
        await client.send(new client_s3_1.CreateBucketCommand({ Bucket: config_1.S3_BUCKET }));
    }
};
exports.ensureBucket = ensureBucket;
const prepareUploads = async (files) => {
    await (0, exports.ensureBucket)();
    const client = (0, exports.getS3)();
    const uploads = [];
    for (const file of files) {
        const id = (0, node_crypto_1.randomUUID)();
        const key = `uploads/${id}`;
        const command = new client_s3_1.PutObjectCommand({
            Bucket: config_1.S3_BUCKET,
            Key: key,
            ContentType: file.mimeType,
            ContentMD5: undefined // optional
        });
        const uploadUrl = await (0, s3_request_presigner_1.getSignedUrl)(client, command, { expiresIn: 60 * 10 }); // 10 minutes
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
exports.prepareUploads = prepareUploads;
