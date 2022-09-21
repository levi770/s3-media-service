import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { GetAllObjectsDataDto } from './common/dto/getAllObjectsData.dto';
import { GetOneObjectDataDto } from './common/dto/getOneObjectsData.dto';
import { NewObjectParamsDto } from './common/dto/newObjectParams.dto';
import { DbManagerService } from './db-manager/db-manager.service';
import { S3ManagerService } from './s3-manager/s3-manager.service';
import { File } from './common/models/file.model';

type allObjects = {
  rows: File[];
  count: number;
};

@Controller()
export class AppController {
  constructor(
    private readonly s3ManagerService: S3ManagerService,
    private readonly dbManagerService: DbManagerService,
  ) {}

  @MessagePattern({ cmd: 'getPutObjectUrl' })
  async getPutObjectUrlMessage(params: NewObjectParamsDto): Promise<string> {
    return await this.s3ManagerService.generatePutObjectUrl(params);
  }

  @MessagePattern({ cmd: 'getAllObjectsDataByKey' })
  async getAllObjectsDataByKeyMessage(
    params: GetAllObjectsDataDto,
  ): Promise<allObjects> {
    return await this.dbManagerService.getAllObjectsData(params);
  }

  @MessagePattern({ cmd: 'getOneObjectDataByKey' })
  async getObjectDataByKeyMessage(params: GetOneObjectDataDto): Promise<File> {
    return await this.dbManagerService.getOneObjectDataByKey(params);
  }
}
