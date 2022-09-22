"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const file_model_1 = require("../common/models/file.model");
const sequelize = new sequelize_typescript_1.Sequelize({
    dialect: 'postgres',
    host: process.env.POSTGRES_HOST,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    port: +process.env.POSTGRES_PORT,
    models: [file_model_1.File],
    logging: false,
});
exports.sequelize = sequelize;
//# sourceMappingURL=worker-db-instance.js.map