import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { File } from '../common/models/file.model';
import { NewObjectParamsDto } from '../common/dto/newObjectParams.dto';
import { GetAllObjectsParamsDto } from '../common/dto/getAllObjectsParams.dto';
import { GetOneObjectParamsDto } from '../common/dto/getOneObjectParams.dto';
import { Order } from 'sequelize';

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

  async getAllObjectsData(params?: GetAllObjectsParamsDto) {
    try {
      const args = {
        attributes: { exclude: ['fileId', 'updatedAt'] },
        offset:
          !params || !params.limit || !params.page
            ? null
            : 0 + (+params.page - 1) * +params.limit,
        limit: !params || !params.limit ? null : +params.limit,
        order: [
          [params.order_by || 'createdAt', params.order || 'DESC'],
        ] as Order,
        include: null,
      };

      if (params.include_child) {
        args.include = [
          {
            model: File,
            attributes: { exclude: ['fileId', 'params', 'updatedAt'] },
          },
        ];
      }

      const result = await this.fileRepository.findAndCountAll(args);

      return {
        status: HttpStatus.OK,
        message: null,
        result,
      };
    } catch (error) {
      if (error.name === 'SequelizeDatabaseError') {
        return {
          status: error.original.code,
          message: error.original.message,
          result: null,
        };
      }

      return {
        status: error.status,
        message: error.message,
        result: null,
      };
    }
  }

  async getOneObjectData(params: GetOneObjectParamsDto) {
    try {
      if (!params) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'params can not be empty',
          result: null,
        };
      }

      if (!params.id && !params.key) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'key or id is required',
          result: null,
        };
      }

      const where = params.id ? { id: params.id } : { key: params.key };

      const args = {
        attributes: { exclude: ['fileId', 'updatedAt'] },
        include: null,
        where,
      };

      if (params.include_child) {
        args.include = [
          {
            model: File,
            attributes: { exclude: ['fileId', 'params', 'updatedAt'] },
          },
        ];
      }

      const result = await this.fileRepository.findOne(args);

      return {
        status: HttpStatus.OK,
        message: null,
        result,
      };
    } catch (error) {
      if (error.name === 'SequelizeDatabaseError') {
        return {
          status: error.original.code,
          message: error.original.message,
          result: null,
        };
      }

      return {
        status: error.status,
        message: error.message,
        result: null,
      };
    }
  }
}
