import { sequelize as sequelizeInstance } from './worker-db-instance';
import { Model, DataTypes } from 'sequelize';

const config = {
  tableName: 'files',
  sequelize: sequelizeInstance,
};

class File extends Model {
  id!: string;
  status: string;
  type: string;
  params: object;
}

File.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    status: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
    params: {
      type: DataTypes.JSON,
    },
  },
  config,
);

export default File;
