import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { NewObjectParamsDto } from './dto/newObjectParams.dto';
import { S3ManagerService } from './s3-manager/s3-manager.service';

@Controller()
export class AppController {
  constructor(private readonly s3ManagerService: S3ManagerService) {}

  @MessagePattern({ cmd: 'getPutObjectUrl' })
  async getPutObjectUrlMessage(params: NewObjectParamsDto): Promise<string> {
    return await this.s3ManagerService.generatePutObjectUrl(params);
  }
}
