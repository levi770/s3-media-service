import { Injectable } from '@nestjs/common';
import { InjectAwsService } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';
import { NewObjectParamsDto } from '../dto/newObjectParams.dto';
import { InjectModel } from '@nestjs/sequelize';
import { File } from '../models/file.model';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3ManagerService {
  constructor(
    @InjectAwsService(S3) private readonly s3: S3,
    @InjectModel(File) private fileRepository: typeof File,
    private readonly configService: ConfigService,
  ) {}

  async listBucketContents(bucket: string) {
    const response = await this.s3.listObjectsV2({ Bucket: bucket }).promise();
    return response.Contents.map((c) => c.Key);
  }

  async generatePutObjectUrl(params: NewObjectParamsDto) {
    const file = await this.fileRepository.create({ params });

    return await this.s3.getSignedUrlPromise('putObject', {
      Bucket: await this.configService.get('S3_BUCKET_NAME'),
      Key: file.id,
      Expires: 600,
    });
  }
}
