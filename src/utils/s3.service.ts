import { PutObjectCommand, S3 } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { AWS_S3_BUCKET, PUT_ASSETS_EXPIRES_IN } from '~/constants/s3'

export class S3Service {
  private readonly s3: S3

  constructor() {
    const accessKeyId = process.env.TRPC_AWS_ACCESS_KEY_ID || 'no-access-key-id'
    const secretAccessKey =
      process.env.TRPC_AWS_SECRET_ACCESS_KEY || 'no-secret-access-key'
    const region = process.env.TRPC_AWS_REGION || 'no-region'

    this.s3 = new S3({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    })
  }

  public getUrlToUpload(key: string) {
    const command = new PutObjectCommand({
      Bucket: AWS_S3_BUCKET,
      Key: key,
    })
    return getSignedUrl(this.s3, command, {
      expiresIn: PUT_ASSETS_EXPIRES_IN,
    })
  }

  public getAssetUrl(key: string) {
    const region = process.env.TRPC_AWS_REGION || 'no-region'
    return `https://${AWS_S3_BUCKET}.s3.${region}.amazonaws.com/${key}`
  }

  public deleteSignedFile(key: string) {
    return this.s3.deleteObject({
      Bucket: AWS_S3_BUCKET,
      Key: key,
    })
  }
}
