import { GetAllObjectsParamsDto } from './common/dto/getAllObjectsParams.dto';
import { GetOneObjectParamsDto } from './common/dto/getOneObjectParams.dto';
import { NewObjectParamsDto } from './common/dto/newObjectParams.dto';
import { DbManagerService } from './db-manager/db-manager.service';
import { S3ManagerService } from './s3-manager/s3-manager.service';
import { File } from './common/models/file.model';
import { ResponseDto } from './common/dto/response.dto';
import { AllObjectsDto } from './common/dto/allObjects.dto';
export declare class AppController {
    private readonly s3ManagerService;
    private readonly dbManagerService;
    constructor(s3ManagerService: S3ManagerService, dbManagerService: DbManagerService);
    getPutObjectUrlMessage(params: NewObjectParamsDto): Promise<ResponseDto>;
    getAllObjectsDataMessage(params: GetAllObjectsParamsDto): Promise<AllObjectsDto | ResponseDto>;
    getObjectDataMessage(params: GetOneObjectParamsDto): Promise<File | ResponseDto>;
}
