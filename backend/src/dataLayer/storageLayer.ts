import 'source-map-support/register'

import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

export class attachmentUtils {

  constructor(
    private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' }),
    private readonly bucketName = process.env.IMAGES_S3_BUCKET,
    private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION
  ) {}

  async generateUrl(purchaseId: string): Promise<string> {
      const attachmentUrl = `https://${this.bucketName}.s3.amazonaws.com/${purchaseId}`
      return attachmentUrl
  }
  async signedUrl(purchaseId: string): Promise<string> {
    console.log("Generating URL");

    const url = this.s3.getSignedUrl('putObject', {
        Bucket: this.bucketName,
        Key: purchaseId,
        Expires: this.urlExpiration,
    });
    console.log(url);

    return url as string;
}
}