"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqsConsumerModule = void 0;
const sqs_1 = require("@nestjs-packages/sqs");
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const sqs_consumer_service_1 = require("./sqs-consumer.service");
const db_manager_module_1 = require("../db-manager/db-manager.module");
let SqsConsumerModule = class SqsConsumerModule {
};
SqsConsumerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bull_1.BullModule.registerQueue({
                name: 'file',
                processors: [
                    {
                        name: 'optimize-image',
                        path: (0, path_1.join)(__dirname, `../sqs-processors/optimize-image.processor.js`),
                    },
                ],
            }),
            sqs_1.SqsModule.registerQueue({
                name: process.env.SQS_QUEUE_NAME,
                type: sqs_1.SqsQueueType.Consumer,
                consumerOptions: {
                    shouldDeleteMessages: true,
                    terminateVisibilityTimeout: true,
                    visibilityTimeout: 20,
                    waitTimeSeconds: 0,
                    messageAttributeNames: ['ObjectCreated:Put'],
                },
                producerOptions: {},
            }),
            db_manager_module_1.DbManagerModule,
        ],
        providers: [sqs_consumer_service_1.SqsConsumerService],
    })
], SqsConsumerModule);
exports.SqsConsumerModule = SqsConsumerModule;
//# sourceMappingURL=sqs-consumer.module.js.map