import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { File } from '../db-manager/models/file.model';
import { NewObjectParamsDto } from '../common/dto/newObjectParams.dto';
import { GetAllObjectsDataDto } from '../common/dto/getAllObjectsData.dto';
import { GetOneObjectDataDto } from '../common/dto/getOneObjectsData.dto';

@Injectable()
export class DbManagerService {
  constructor(@InjectModel(File) private fileRepository: typeof File) {}

  async createFile(params: NewObjectParamsDto) {
    return await this.fileRepository.create({ params });
  }

  async findByPk(pk: string) {
    return await this.fileRepository.findByPk(pk);
  }

  async getAllObjectsDataByKey(params?: GetAllObjectsDataDto) {
    return await this.fileRepository.findAndCountAll({
      include: [{ model: File }],
      offset:
        !params || !params.limit || !params.page
          ? null
          : 0 + (+params.page - 1) * +params.limit,
      limit: !params || !params.limit ? null : params.limit,
      order: [[params.order_by, params.order]],
    });
  }

  async getOneObjectDataByKey(params: GetOneObjectDataDto) {
    return await this.fileRepository.findOne({
      where: { id: params.key },
      include: [{ model: File }],
    });
  }
}
