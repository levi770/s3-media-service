import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { GetAllObjectsDataDto } from './common/dto/getAllObjectsData.dto';
import { GetOneObjectDataDto } from './common/dto/getOneObjectsData.dto';
import { NewObjectParamsDto } from './common/dto/newObjectParams.dto';
import { DbManagerService } from './db-manager/db-manager.service';
import { S3ManagerService } from './s3-manager/s3-manager.service';
import { File } from './common/models/file.model';
import { ResponceDto } from './common/dto/responce.dto';

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
  async getPutObjectUrlMessage(
    params: NewObjectParamsDto,
  ): Promise<ResponceDto> {
    return await this.s3ManagerService.generatePutObjectUrl(params);
  }

  @MessagePattern({ cmd: 'getAllObjectsData' })
  async getAllObjectsDataMessage(
    params: GetAllObjectsDataDto,
  ): Promise<allObjects | ResponceDto> {
    return await this.dbManagerService.getAllObjectsData(params);
  }

  @MessagePattern({ cmd: 'getOneObjectData' })
  async getObjectDataMessage(
    params: GetOneObjectDataDto,
  ): Promise<File | ResponceDto> {
    return await this.dbManagerService.getOneObjectData(params);
  }
}
