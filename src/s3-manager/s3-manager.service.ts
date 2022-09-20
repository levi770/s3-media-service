import { Injectable } from '@nestjs/common';
import { InjectAwsService } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';
import { NewObjectParamsDto } from '../common/dto/newObjectParams.dto';
import { ConfigService } from '@nestjs/config';
import { DbManagerService } from '../db-manager/db-manager.service';

@Injectable()
export class S3ManagerService {
  constructor(
    @InjectAwsService(S3) private readonly s3: S3,
    private readonly dbManagerService: DbManagerService,
    private readonly configService: ConfigService,
  ) {}

  async listBucketContents(bucket: string) {
    const response = await this.s3.listObjectsV2({ Bucket: bucket }).promise();
    return response.Contents.map((c) => c.Key);
  }

  async generatePutObjectUrl(params: NewObjectParamsDto) {
    const file = await this.dbManagerService.createFile(params);
    file.key = `${file.id}.original.${params.originalname}`;
    file.save();

    return await this.s3.getSignedUrlPromise('putObject', {
      Bucket: await this.configService.get('S3_BUCKET_NAME'),
      ContentType: params.fileType,
      //ACL: 'public-read',
      Key: file.key,
      Expires: 600,
    });
  }
}
