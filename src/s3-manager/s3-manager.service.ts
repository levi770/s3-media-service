import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectAwsService } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';
import { NewObjectParamsDto } from '../common/dto/newObjectParams.dto';
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

  async generateNewObjectUrl(params: NewObjectParamsDto) {
    if (params.resize) {
      const size = params.size.split(',');
      const isSizeNumbersOk = +size[0] > 0 && +size[1] > 0;

      if (!isSizeNumbersOk) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message:
            'size must contain two comma separated numbers (width,height)',
          result: null,
        };
      }

      params.size = JSON.stringify({ width: size[0], height: size[1] });
    }

    const file = await this.dbManagerService.createFile(params);
    file.key = `${file.id}.original.${params.originalname}`;
    file.save();

    const url = await this.s3.getSignedUrlPromise('putObject', {
      Bucket: await this.configService.get('S3_BUCKET_NAME'),
      ContentType: params.fileType,
      Key: file.key,
      Expires: 600,
    });

    return {
      status: HttpStatus.OK,
      message: null,
      result: { url },
    };
  }
}
