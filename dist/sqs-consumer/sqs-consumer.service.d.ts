import { SQS } from 'aws-sdk';
import { Queue } from 'bull';
import { DbManagerService } from '../db-manager/db-manager.service';
export declare class SqsConsumerService {
    private readonly dbManagerService;
    private readonly fileQueue;
    constructor(dbManagerService: DbManagerService, fileQueue: Queue);
    handleMessage(message: SQS.Message): Promise<void>;
    onProcessingError(error: Error, message: SQS.Message): void;
}
