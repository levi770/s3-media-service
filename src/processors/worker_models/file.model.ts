import { sequelize as sequelizeInstance } from './worker-db-instance';
import { Model, DataTypes, HasManyAddAssociationsMixin } from 'sequelize';

const config = {
  tableName: 'files',
  sequelize: sequelizeInstance,
};

class File extends Model {
  id!: string;
  name: string;
  encoding: string;
  mimetype: string;
  size: number;
  status: string;
  type: string;
  params: object;
  processed_files: File[];
  addFile: HasManyAddAssociationsMixin<File, File['id']>;
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

File.hasMany(File, {
  sourceKey: 'id',
  foreignKey: 'fileId',
  as: 'processed_files',
});

export default File;
