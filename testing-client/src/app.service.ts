import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { GetUploadUrlDto } from './dto/getUploadUrl.dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(@Inject('S3_SERVICE') private client: ClientProxy) {}

  async getUploadUrl(query?: GetUploadUrlDto) {
    return lastValueFrom(this.client.send({ cmd: 'getPutObjectUrl' }, query));
  }
}
