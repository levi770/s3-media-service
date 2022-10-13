import { Job, DoneCallback } from 'bull';
import { S3 } from 'aws-sdk';
import { join } from 'path';
import * as fs from 'fs';
import * as fsAsync from 'fs/promises';
import * as sharp from 'sharp';
import { NewObjectParamsDto } from '../common/dto/newObjectParams.dto';
import { File as fileRepo } from '../common/models/file.model';
import { sequelize } from './worker-db-instance';

(async () => {
  await sequelize.sync();
})();

if (!fs.existsSync(join(process.cwd(), `/tmp`))) {
  fs.mkdirSync(join(process.cwd(), `/tmp`));
}

const s3 = new S3();

const downloadParams = {
  Bucket: process.env.S3_BUCKET_NAME,
  Key: null,
};

const uploadParams = {
  Bucket: process.env.S3_BUCKET_NAME,
  ContentType: null,
  Key: null,
  Body: null,
};

async function imageProcessor(job: Job, doneCallback: DoneCallback) {
  try {
    const objData: fileRepo = job.data;
    const objParams: NewObjectParamsDto = job.data.params;
    const obj = await fileRepo.findByPk(objData.id);

    downloadParams.Key = objData.key;

    const file = s3.getObject(downloadParams).createReadStream();
    const fileName = objParams.originalname.split('.')[0];
    const filePath = join(process.cwd(), `/tmp/${objData.key}`);
    await fsAsync.writeFile(filePath, file);

    const processedFile = sharp(filePath).webp({
      quality: +objParams.quality || 80,
    });

    if (objParams.resize) {
      const size = JSON.parse(objParams.size);
      processedFile.resize(+size.width, +size.height);
    }

    await processedFile.toBuffer();

    const processedFilePath = join(
      process.cwd(),
      `/tmp/converted-${objData.id}.${fileName}.webp`,
    );

    await fsAsync.writeFile(processedFilePath, processedFile);

    const newObject = await fileRepo.create({
      status: 'initial',
      type: 'optimized',
    });

    const newObjKey = `${newObject.id}.converted.${fileName}.webp`;

    uploadParams.Key = newObjKey;
    uploadParams.Body = processedFile;

    newObject.key = newObjKey;
    await newObject.save();

    obj.$add('processed_file', newObject);

    s3.upload(uploadParams, async (error: Error, data: any) => {
      if (error) {
        newObject.status = 'failed';
        await newObject.save();

        doneCallback(error, null);
      } else {
        newObject.status = 'uploaded';
        await newObject.save();

        await fsAsync.unlink(filePath);
        await fsAsync.unlink(processedFilePath);

        doneCallback(null, data);
      }
    });
  } catch (error) {
    doneCallback(error, null);
  }
}

export default imageProcessor;
