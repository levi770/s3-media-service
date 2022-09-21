import { Sequelize } from 'sequelize-typescript';
import { File } from '../common/models/file.model';

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.POSTGRES_HOST,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: +process.env.POSTGRES_PORT,
  models: [File],
  logging: false,
});

export { sequelize };
