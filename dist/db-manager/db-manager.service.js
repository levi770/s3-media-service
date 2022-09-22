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
        if (params.include_child === 'true') {
            return await this.fileRepository.findAndCountAll({
                attributes: { exclude: ['fileId', 'updatedAt'] },
                include: [
                    {
                        model: file_model_1.File,
                        attributes: { exclude: ['fileId', 'params', 'updatedAt'] },
                    },
                ],
                offset: !params || !params.limit || !params.page
                    ? null
                    : 0 + (+params.page - 1) * +params.limit,
                limit: !params || !params.limit ? null : +params.limit,
                order: [[params.order_by || 'createdAt', params.order || 'DESC']],
            });
        }
        return await this.fileRepository.findAndCountAll({
            attributes: { exclude: ['fileId', 'updatedAt'] },
            offset: !params || !params.limit || !params.page
                ? null
                : 0 + (+params.page - 1) * +params.limit,
            limit: !params || !params.limit ? null : +params.limit,
            order: [[params.order_by || 'createdAt', params.order || 'DESC']],
        });
    }
    async getOneObjectData(params) {
        let reqArgs = {};
        if (params.id) {
            reqArgs = {
                id: params.id,
            };
        }
        else if (params.key) {
            reqArgs = {
                key: params.key,
            };
        }
        else {
            return {
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'key or id is required',
            };
        }
        if (params.include_child === 'true') {
            return await this.fileRepository.findOne({
                where: reqArgs,
                attributes: { exclude: ['fileId', 'updatedAt'] },
                include: [
                    {
                        model: file_model_1.File,
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
};
DbManagerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(file_model_1.File)),
    __metadata("design:paramtypes", [Object])
], DbManagerService);
exports.DbManagerService = DbManagerService;
//# sourceMappingURL=db-manager.service.js.map