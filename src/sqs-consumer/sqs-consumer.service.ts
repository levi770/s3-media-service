import {
  SqsConsumerEvent,
  SqsConsumerEventHandler,
  SqsMessageHandler,
  SqsProcess,
} from '@nestjs-packages/sqs';
import { Injectable } from '@nestjs/common';
import { SQS } from 'aws-sdk';

@Injectable()
@SqsProcess(/** name: */ 'levi770devQueue')
export class SqsConsumerService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  // @SqsMessageHandler('levi770devQueue', false)
  // async handleMessage(message: SQS.Message) {
  //   const obj: any = JSON.parse(message.Body) as {
  //     message: string;
  //     date: string;
  //   };
  //   const { data } = JSON.parse(obj.Message);

  //   // use the data and consume it the way you want //
  // }

  @SqsMessageHandler(/** batch: */ false)
  public async handleMessage(message: SQS.Message) {
    console.log(message);
    //TODO image processing
  }

  @SqsConsumerEventHandler(/** eventName: */ SqsConsumerEvent.PROCESSING_ERROR)
  public onProcessingError(error: Error, message: SQS.Message) {
    console.log(error);
    console.log(message);
  }
}
