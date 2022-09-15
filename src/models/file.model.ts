import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'files' })
export class File extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: number;

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
}
