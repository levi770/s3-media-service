import {
  SqsConsumerEvent,
  SqsConsumerEventHandler,
  SqsMessageHandler,
  SqsProcess,
} from '@nestjs-packages/sqs';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { SQS } from 'aws-sdk';
import { Queue } from 'bull';
import { NewObjectParamsDto } from '../common/dto/newObjectParams.dto';
import { DbManagerService } from '../db-manager/db-manager.service';

@Injectable()
@SqsProcess(/** name: */ 'levi770devQueue')
export class SqsConsumerService {
  constructor(
    private readonly dbManagerService: DbManagerService,
    @InjectQueue('file') private readonly fileQueue: Queue,
  ) {}

  @SqsMessageHandler(/** batch: */ false)
  public async handleMessage(message: SQS.Message) {
    const msgBody: any = JSON.parse(message.Body);
    const objKey = msgBody.Records[0].s3.object.key;
    const obj = await this.dbManagerService.findByPk(objKey);
    const objParams = obj.params as NewObjectParamsDto;

    obj.status = 'uploaded';
    obj.save();

    if (obj.type === 'original' && objParams.optimize) {
      await this.fileQueue.add('optimize-image', obj);
    } else if (obj.type != 'original') {
      obj.status = 'uploaded';
      obj.save();
    }
  }

  @SqsConsumerEventHandler(/** eventName: */ SqsConsumerEvent.PROCESSING_ERROR)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  public onProcessingError(error: Error, message: SQS.Message) {}
}
