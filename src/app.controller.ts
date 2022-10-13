import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { GetAllObjectsParamsDto } from './common/dto/getAllObjectsParams.dto';
import { GetOneObjectParamsDto } from './common/dto/getOneObjectParams.dto';
import { NewObjectParamsDto } from './common/dto/newObjectParams.dto';
import { DbManagerService } from './db-manager/db-manager.service';
import { S3ManagerService } from './s3-manager/s3-manager.service';
import { File } from './common/models/file.model';
import { ResponseDto } from './common/dto/response.dto';
import { AllObjectsDto } from './common/dto/allObjects.dto';

@Controller()
export class AppController {
  constructor(
    private readonly s3ManagerService: S3ManagerService,
    private readonly dbManagerService: DbManagerService,
  ) {}

  @MessagePattern({ cmd: 'getNewObjectUrl' })
  async getNewObjectUrlMessage(
    params: NewObjectParamsDto,
  ): Promise<ResponseDto> {
    return await this.s3ManagerService.generateNewObjectUrl(params);
  }

  @MessagePattern({ cmd: 'getAllObjectsData' })
  async getAllObjectsDataMessage(
    params: GetAllObjectsParamsDto,
  ): Promise<AllObjectsDto | ResponseDto> {
    return await this.dbManagerService.getAllObjectsData(params);
  }

  @MessagePattern({ cmd: 'getOneObjectData' })
  async getObjectDataMessage(
    params: GetOneObjectParamsDto,
  ): Promise<File | ResponseDto> {
    return await this.dbManagerService.getOneObjectData(params);
  }
}
