import { sequelize as sequelizeInstance } from './worker-db-instance';
import { Model, DataTypes } from 'sequelize';

const config = {
  tableName: 'files',
  sequelize: sequelizeInstance,
};

class File extends Model {
  id!: string;
  key: string;
  status: string;
  type: string;
  params: object;
  processed_files: File[];
  fileId: string;
}

File.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    key: {
      type: DataTypes.STRING,
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
    fileId: {
      type: DataTypes.STRING,
    },
  },
  config,
);

File.hasMany(File, {
  as: 'processed_files',
});

File.belongsTo(File, {
  foreignKey: 'fileId',
});

export default File;
