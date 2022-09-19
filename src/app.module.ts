import { SqsConfig, SqsConfigOption, SqsModule } from '@nestjs-packages/sqs';
import { SequelizeModule } from '@nestjs/sequelize';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AwsSdkModule } from 'nest-aws-sdk';
import { AppController } from './app.controller';
import { File } from './db-manager/models/file.model';
import { S3ManagerModule } from './s3-manager/s3-manager.module';
import { SqsConsumerModule } from './sqs-consumer/sqs-consumer.module';
import * as Joi from '@hapi/joi';
import { DbManagerModule } from './db-manager/db-manager.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        AWS_REGION: Joi.string().required(),
        S3_BUCKET_NAME: Joi.string().required(),
        SQS_QUEUE_NAME: Joi.string().required(),
        SQS_QUEUE_URL: Joi.string().required(),
        AWS_ACCOUNT: Joi.string().required(),
        ACCESS_KEY_ID: Joi.string().required(),
        SECRET_ACCESS_KEY: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
      }),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        url: `redis://${await configService.get(
          'REDIS_HOST',
        )}:${await configService.get('REDIS_PORT')}`,
      }),
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          dialect: 'postgres',
          host: await configService.get('POSTGRES_HOST'),
          port: +(await configService.get('POSTGRES_PORT')),
          username: await configService.get('POSTGRES_USER'),
          password: await configService.get('POSTGRES_PASSWORD'),
          database: await configService.get('POSTGRES_DB'),
          models: [File],
          autoLoadModels: true,
          synchronize: true,
          logging: false,
        };
      },
    }),
    AwsSdkModule.forRootAsync({
      defaultServiceOptions: {
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
          return {
            region: await configService.get('AWS_REGION'),
            credentials: {
              accessKeyId: await configService.get('ACCESS_KEY_ID'),
              secretAccessKey: await configService.get('SECRET_ACCESS_KEY'),
            },
          };
        },
      },
    }),
    SqsModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const config: SqsConfigOption = {
          region: await configService.get('AWS_REGION'),
          endpoint: await configService.get('SQS_QUEUE_URL'),
          accountNumber: await configService.get('AWS_ACCOUNT'),
          credentials: {
            accessKeyId: await configService.get('ACCESS_KEY_ID'),
            secretAccessKey: await configService.get('SECRET_ACCESS_KEY'),
          },
        };
        return new SqsConfig(config);
      },
    }),
    S3ManagerModule,
    SqsConsumerModule,
    DbManagerModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
