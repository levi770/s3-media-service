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
exports.SqsConsumerService = void 0;
const sqs_1 = require("@nestjs-packages/sqs");
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const aws_sdk_1 = require("aws-sdk");
const db_manager_service_1 = require("../db-manager/db-manager.service");
let SqsConsumerService = class SqsConsumerService {
    constructor(dbManagerService, fileQueue) {
        this.dbManagerService = dbManagerService;
        this.fileQueue = fileQueue;
    }
    async handleMessage(message) {
        const msgBody = JSON.parse(message.Body);
        const key = msgBody.Records[0].s3.object.key;
        const obj = await this.dbManagerService.findByKey(key);
        const objParams = obj.params;
        obj.status = 'uploaded';
        obj.save();
        if (obj.type === 'original' && objParams.optimize) {
            await this.fileQueue.add('optimize-image', obj);
        }
    }
    onProcessingError(error, message) { }
};
__decorate([
    (0, sqs_1.SqsMessageHandler)(false),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SqsConsumerService.prototype, "handleMessage", null);
__decorate([
    (0, sqs_1.SqsConsumerEventHandler)(sqs_1.SqsConsumerEvent.PROCESSING_ERROR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Error, Object]),
    __metadata("design:returntype", void 0)
], SqsConsumerService.prototype, "onProcessingError", null);
SqsConsumerService = __decorate([
    (0, common_1.Injectable)(),
    (0, sqs_1.SqsProcess)('levi770devQueue'),
    __param(1, (0, bull_1.InjectQueue)('file')),
    __metadata("design:paramtypes", [db_manager_service_1.DbManagerService, Object])
], SqsConsumerService);
exports.SqsConsumerService = SqsConsumerService;
//# sourceMappingURL=sqs-consumer.service.js.map