import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DbManagerService } from './db-manager.service';
import { File } from '../common/models/file.model';

@Module({
  imports: [SequelizeModule.forFeature([File])],
  providers: [DbManagerService],
  exports: [DbManagerService],
})
export class DbManagerModule {}
