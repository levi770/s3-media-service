import { SqsModule, SqsQueueType } from '@nestjs-packages/sqs';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { SqsConsumerService } from './sqs-consumer.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'file',
      processors: [
        {
          name: 'optimize-image',
          path: join(
            __dirname,
            `../processor/optimize-image.processor.${
              process.env.NODE_ENV === 'dev' ? 'ts' : 'js'
            }`,
          ),
        },
      ],
    }),
    SqsModule.registerQueue({
      name: 'levi770devQueue',
      type: SqsQueueType.Consumer,
      consumerOptions: {
        shouldDeleteMessages: true,
        terminateVisibilityTimeout: true,
        visibilityTimeout: 20,
        waitTimeSeconds: 0,
        messageAttributeNames: ['ObjectCreated:Put'],
      },
      producerOptions: {},
    }),
  ],
  providers: [SqsConsumerService],
})
export class SqsConsumerModule {}
