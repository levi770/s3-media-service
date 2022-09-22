"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const Joi = require("@hapi/joi");
const sqs_1 = require("@nestjs-packages/sqs");
const sequelize_1 = require("@nestjs/sequelize");
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nest_aws_sdk_1 = require("nest-aws-sdk");
const app_controller_1 = require("./app.controller");
const file_model_1 = require("./common/models/file.model");
const s3_manager_module_1 = require("./s3-manager/s3-manager.module");
const sqs_consumer_module_1 = require("./sqs-consumer/sqs-consumer.module");
const db_manager_module_1 = require("./db-manager/db-manager.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
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
            bull_1.BullModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => ({
                    url: `redis://${await configService.get('REDIS_HOST')}:${await configService.get('REDIS_PORT')}`,
                }),
            }),
            sequelize_1.SequelizeModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => {
                    return {
                        dialect: 'postgres',
                        host: await configService.get('POSTGRES_HOST'),
                        port: +(await configService.get('POSTGRES_PORT')),
                        username: await configService.get('POSTGRES_USER'),
                        password: await configService.get('POSTGRES_PASSWORD'),
                        database: await configService.get('POSTGRES_DB'),
                        models: [file_model_1.File],
                        autoLoadModels: true,
                        synchronize: true,
                        logging: false,
                    };
                },
            }),
            nest_aws_sdk_1.AwsSdkModule.forRootAsync({
                defaultServiceOptions: {
                    imports: [config_1.ConfigModule],
                    inject: [config_1.ConfigService],
                    useFactory: async (configService) => {
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
            sqs_1.SqsModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => {
                    const config = {
                        region: await configService.get('AWS_REGION'),
                        endpoint: await configService.get('SQS_QUEUE_URL'),
                        accountNumber: await configService.get('AWS_ACCOUNT'),
                        credentials: {
                            accessKeyId: await configService.get('ACCESS_KEY_ID'),
                            secretAccessKey: await configService.get('SECRET_ACCESS_KEY'),
                        },
                    };
                    return new sqs_1.SqsConfig(config);
                },
            }),
            s3_manager_module_1.S3ManagerModule,
            sqs_consumer_module_1.SqsConsumerModule,
            db_manager_module_1.DbManagerModule,
        ],
        controllers: [app_controller_1.AppController],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map