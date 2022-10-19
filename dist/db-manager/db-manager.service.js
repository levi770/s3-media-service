"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbManagerService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const file_model_1 = require("../common/models/file.model");
let DbManagerService = class DbManagerService {
    constructor(fileRepository) {
        this.fileRepository = fileRepository;
    }
    async createFile(params) {
        return await this.fileRepository.create({ params });
    }
    async findByPk(pk) {
        return await this.fileRepository.findByPk(pk);
    }
    async findByKey(key) {
        return await this.fileRepository.findOne({ where: { key } });
    }
    async getAllObjectsData(params) {
        try {
            const args = {
                attributes: { exclude: ['fileId', 'updatedAt'] },
                offset: !params || !params.limit || !params.page
                    ? null
                    : 0 + (+params.page - 1) * +params.limit,
                limit: !params || !params.limit ? null : +params.limit,
                order: [
                    [params.order_by || 'createdAt', params.order || 'DESC'],
                ],
                include: null,
            };
            if (params.include_child) {
                args.include = [
                    {
                        model: file_model_1.File,
                        attributes: { exclude: ['fileId', 'params', 'updatedAt'] },
                    },
                ];
            }
            const result = await this.fileRepository.findAndCountAll(args);
            return {
                status: common_1.HttpStatus.OK,
                message: null,
                result,
            };
        }
        catch (error) {
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
    async getOneObjectData(params) {
        try {
            if (!params) {
                return {
                    status: common_1.HttpStatus.BAD_REQUEST,
                    message: 'params can not be empty',
                    result: null,
                };
            }
            if (!params.id && !params.key) {
                return {
                    status: common_1.HttpStatus.BAD_REQUEST,
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
                        model: file_model_1.File,
                        attributes: { exclude: ['fileId', 'params', 'updatedAt'] },
                    },
                ];
            }
            const result = await this.fileRepository.findOne(args);
            return {
                status: common_1.HttpStatus.OK,
                message: null,
                result,
            };
        }
        catch (error) {
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
};
DbManagerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(file_model_1.File)),
    __metadata("design:paramtypes", [Object])
], DbManagerService);
exports.DbManagerService = DbManagerService;
//# sourceMappingURL=db-manager.service.js.map