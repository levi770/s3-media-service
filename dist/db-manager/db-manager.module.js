"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbManagerModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const db_manager_service_1 = require("./db-manager.service");
const file_model_1 = require("../common/models/file.model");
let DbManagerModule = class DbManagerModule {
};
DbManagerModule = __decorate([
    (0, common_1.Module)({
        imports: [sequelize_1.SequelizeModule.forFeature([file_model_1.File])],
        providers: [db_manager_service_1.DbManagerService],
        exports: [db_manager_service_1.DbManagerService],
    })
], DbManagerModule);
exports.DbManagerModule = DbManagerModule;
//# sourceMappingURL=db-manager.module.js.map