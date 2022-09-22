"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3ManagerModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nest_aws_sdk_1 = require("nest-aws-sdk");
const aws_sdk_1 = require("aws-sdk");
const db_manager_module_1 = require("../db-manager/db-manager.module");
const s3_manager_service_1 = require("./s3-manager.service");
let S3ManagerModule = class S3ManagerModule {
};
S3ManagerModule = __decorate([
    (0, common_1.Module)({
        imports: [db_manager_module_1.DbManagerModule, nest_aws_sdk_1.AwsSdkModule.forFeatures([aws_sdk_1.S3]), config_1.ConfigModule],
        providers: [s3_manager_service_1.S3ManagerService],
        exports: [s3_manager_service_1.S3ManagerService],
    })
], S3ManagerModule);
exports.S3ManagerModule = S3ManagerModule;
//# sourceMappingURL=s3-manager.module.js.map