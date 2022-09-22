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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const getAllObjectsParams_dto_1 = require("./common/dto/getAllObjectsParams.dto");
const getOneObjectParams_dto_1 = require("./common/dto/getOneObjectParams.dto");
const newObjectParams_dto_1 = require("./common/dto/newObjectParams.dto");
const db_manager_service_1 = require("./db-manager/db-manager.service");
const s3_manager_service_1 = require("./s3-manager/s3-manager.service");
let AppController = class AppController {
    constructor(s3ManagerService, dbManagerService) {
        this.s3ManagerService = s3ManagerService;
        this.dbManagerService = dbManagerService;
    }
    async getPutObjectUrlMessage(params) {
        return await this.s3ManagerService.generatePutObjectUrl(params);
    }
    async getAllObjectsDataMessage(params) {
        return await this.dbManagerService.getAllObjectsData(params);
    }
    async getObjectDataMessage(params) {
        return await this.dbManagerService.getOneObjectData(params);
    }
};
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'getPutObjectUrl' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [newObjectParams_dto_1.NewObjectParamsDto]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getPutObjectUrlMessage", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'getAllObjectsData' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [getAllObjectsParams_dto_1.GetAllObjectsParamsDto]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getAllObjectsDataMessage", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'getOneObjectData' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [getOneObjectParams_dto_1.GetOneObjectParamsDto]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getObjectDataMessage", null);
AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [s3_manager_service_1.S3ManagerService,
        db_manager_service_1.DbManagerService])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map