import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { File } from '../common/models/file.model';
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

  async findByKey(key: string) {
    return await this.fileRepository.findOne({ where: { key } });
  }

  async getAllObjectsData(params?: GetAllObjectsDataDto) {
    if (params.include_child === 'true') {
      return await this.fileRepository.findAndCountAll({
        attributes: { exclude: ['fileId', 'updatedAt'] },
        include: [
          {
            model: File,
            attributes: { exclude: ['fileId', 'params', 'updatedAt'] },
          },
        ],
        offset:
          !params || !params.limit || !params.page
            ? null
            : 0 + (+params.page - 1) * +params.limit,
        limit: !params || !params.limit ? null : +params.limit,
        order: [[params.order_by || 'createdAt', params.order || 'DESC']],
      });
    }

    return await this.fileRepository.findAndCountAll({
      attributes: { exclude: ['fileId', 'updatedAt'] },
      offset:
        !params || !params.limit || !params.page
          ? null
          : 0 + (+params.page - 1) * +params.limit,
      limit: !params || !params.limit ? null : +params.limit,
      order: [[params.order_by || 'createdAt', params.order || 'DESC']],
    });
  }

  async getOneObjectData(params: GetOneObjectDataDto) {
    let reqArgs = {};

    if (params.id) {
      reqArgs = {
        id: params.id,
      };
    } else if (params.key) {
      reqArgs = {
        key: params.key,
      };
    } else {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'key or id is required',
      };
    }

    if (params.include_child === 'true') {
      return await this.fileRepository.findOne({
        where: reqArgs,
        attributes: { exclude: ['fileId', 'updatedAt'] },
        include: [
          {
            model: File,
            attributes: { exclude: ['fileId', 'params', 'updatedAt'] },
          },
        ],
      });
    }

    return await this.fileRepository.findOne({
      where: reqArgs,
      attributes: { exclude: ['fileId', 'updatedAt'] },
    });
  }
}
