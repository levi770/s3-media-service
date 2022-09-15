import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { S3 } from 'aws-sdk';
import { AwsSdkModule } from 'nest-aws-sdk';
import { File } from '../models/file.model';
import { S3ManagerService } from './s3-manager.service';

@Module({
  imports: [
    SequelizeModule.forFeature([File]),
    AwsSdkModule.forFeatures([S3]),
    ConfigModule,
  ],
  providers: [S3ManagerService],
  exports: [S3ManagerService],
})
export class S3ManagerModule {}
