import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AwsSdkModule } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';
import { DbManagerModule } from '../db-manager/db-manager.module';
import { S3ManagerService } from './s3-manager.service';

@Module({
  imports: [DbManagerModule, AwsSdkModule.forFeatures([S3]), ConfigModule],
  providers: [S3ManagerService],
  exports: [S3ManagerService],
})
export class S3ManagerModule {}
