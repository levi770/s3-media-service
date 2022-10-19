import { HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { NewObjectParamsDto } from '../common/dto/newObjectParams.dto';
import { DbManagerService } from '../db-manager/db-manager.service';
export declare class S3ManagerService {
    private readonly s3;
    private readonly dbManagerService;
    private readonly configService;
    constructor(s3: S3, dbManagerService: DbManagerService, configService: ConfigService);
    listBucketContents(bucket: string): Promise<string[]>;
    generateNewObjectUrl(params: NewObjectParamsDto): Promise<{
        status: HttpStatus;
        message: string;
        result: any;
    } | {
        status: HttpStatus;
        message: any;
        result: {
            url: string;
        };
    }>;
}
