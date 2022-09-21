import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { GetAllObjectsParamsDto } from './common/dto/getAllObjectsParams.dto';
import { GetOneObjectParamsDto } from './common/dto/getOneObjectParams.dto';
import { NewObjectParamsDto } from './common/dto/newObjectParams.dto';
import { DbManagerService } from './db-manager/db-manager.service';
import { S3ManagerService } from './s3-manager/s3-manager.service';
import { File } from './common/models/file.model';
import { ResponceDto } from './common/dto/responce.dto';
import { AllObjectsDto } from './common/dto/allObjects.dto';

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
    params: GetAllObjectsParamsDto,
  ): Promise<AllObjectsDto | ResponceDto> {
    return await this.dbManagerService.getAllObjectsData(params);
  }

  @MessagePattern({ cmd: 'getOneObjectData' })
  async getObjectDataMessage(
    params: GetOneObjectParamsDto,
  ): Promise<File | ResponceDto> {
    return await this.dbManagerService.getOneObjectData(params);
  }
}
