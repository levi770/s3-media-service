import { Model } from 'sequelize-typescript';
export declare class File extends Model {
    id: string;
    key: string;
    status: string;
    type: string;
    params: object;
    processed_files: File[];
    fileId: string;
}
