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
var File_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.File = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
let File = File_1 = class File extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], File.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING }),
    __metadata("design:type", String)
], File.prototype, "key", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM('initial', 'pending', 'uploaded', 'failed', 'deleted'),
        defaultValue: 'initial',
    }),
    __metadata("design:type", String)
], File.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM('original', 'optimized', 'converted'),
        defaultValue: 'original',
    }),
    __metadata("design:type", String)
], File.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSON }),
    __metadata("design:type", Object)
], File.prototype, "params", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => File_1, { onDelete: 'CASCADE' }),
    __metadata("design:type", Array)
], File.prototype, "processed_files", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => File_1),
    __metadata("design:type", String)
], File.prototype, "fileId", void 0);
File = File_1 = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'files' })
], File);
exports.File = File;
//# sourceMappingURL=file.model.js.map