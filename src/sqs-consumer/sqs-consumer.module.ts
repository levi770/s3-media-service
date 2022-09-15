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
        waitTimeSeconds: 1,
        batchSize: 3,
        terminateVisibilityTimeout: true,
        messageAttributeNames: ['All'],
      },
      producerOptions: {},
    }),
  ],
  providers: [SqsConsumerService],
})
export class SqsConsumerModule {}
