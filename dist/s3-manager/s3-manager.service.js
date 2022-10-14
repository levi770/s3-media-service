"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3ManagerService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nest_aws_sdk_1 = require("nest-aws-sdk");
const aws_sdk_1 = require("aws-sdk");
const db_manager_service_1 = require("../db-manager/db-manager.service");
let S3ManagerService = class S3ManagerService {
    constructor(s3, dbManagerService, configService) {
        this.s3 = s3;
        this.dbManagerService = dbManagerService;
        this.configService = configService;
    }
    async listBucketContents(bucket) {
        const response = await this.s3.listObjectsV2({ Bucket: bucket }).promise();
        return response.Contents.map((c) => c.Key);
    }
    async generateNewObjectUrl(params) {
        if (params.resize) {
            const size = params.size.split(',');
            const isSizeNumbersOk = +size[0] > 0 && +size[1] > 0;
            if (!isSizeNumbersOk) {
                return {
                    status: common_1.HttpStatus.BAD_REQUEST,
                    message: 'size must contain two comma separated numbers (width,height)',
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
            status: common_1.HttpStatus.OK,
            message: url,
        };
    }
};
S3ManagerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nest_aws_sdk_1.InjectAwsService)(aws_sdk_1.S3)),
    __metadata("design:paramtypes", [aws_sdk_1.S3,
        db_manager_service_1.DbManagerService,
        config_1.ConfigService])
], S3ManagerService);
exports.S3ManagerService = S3ManagerService;
//# sourceMappingURL=s3-manager.service.js.map