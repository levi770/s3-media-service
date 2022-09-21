import { File } from '../models/file.model';

export class AllObjectsDto {
  rows: File[];
  count: number;
}
