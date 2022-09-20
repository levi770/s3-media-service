import {
  Column,
  DataType,
  HasMany,
  Model,
  Table,
  ForeignKey,
} from 'sequelize-typescript';

@Table({ tableName: 'files' })
export class File extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({ type: DataType.STRING })
  key: string;

  @Column({
    type: DataType.ENUM('initial', 'pending', 'uploaded', 'failed', 'deleted'),
    defaultValue: 'initial',
  })
  status: string;

  @Column({
    type: DataType.ENUM('original', 'optimized', 'converted'),
    defaultValue: 'original',
  })
  type: string;

  @Column({ type: DataType.JSON })
  params: object;

  @HasMany(() => File, { onDelete: 'CASCADE' })
  processed_files: File[];

  @ForeignKey(() => File)
  fileId: string;
}
