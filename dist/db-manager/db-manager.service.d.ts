import { HttpStatus } from '@nestjs/common';
import { File } from '../common/models/file.model';
import { NewObjectParamsDto } from '../common/dto/newObjectParams.dto';
import { GetAllObjectsParamsDto } from '../common/dto/getAllObjectsParams.dto';
import { GetOneObjectParamsDto } from '../common/dto/getOneObjectParams.dto';
export declare class DbManagerService {
    private fileRepository;
    constructor(fileRepository: typeof File);
    createFile(params: NewObjectParamsDto): Promise<File>;
    findByPk(pk: string): Promise<File>;
    findByKey(key: string): Promise<File>;
    getAllObjectsData(params?: GetAllObjectsParamsDto): Promise<{
        rows: File[];
        count: number;
    }>;
    getOneObjectData(params: GetOneObjectParamsDto): Promise<File | {
        status: HttpStatus;
        message: string;
    }>;
}
