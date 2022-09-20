import { Job, DoneCallback } from 'bull';
import * as fs from 'fs';
import * as fsAsync from 'fs/promises';
import { S3 } from 'aws-sdk';
import { join } from 'path';
import * as sharp from 'sharp';
import { NewObjectParamsDto } from '../common/dto/newObjectParams.dto';
import File from './worker_models/file.model';

const s3 = new S3();

if (!fs.existsSync(join(process.cwd(), `/tmp`))) {
  fs.mkdirSync(join(process.cwd(), `/tmp`));
}

const downloadParams = {
  Bucket: process.env.S3_BUCKET_NAME,
  Key: null,
};

const uploadParams = {
  Bucket: process.env.S3_BUCKET_NAME,
  ContentType: null,
  //ACL: 'public-read',
  Key: null,
  Body: null,
};

async function imageProcessor(job: Job, doneCallback: DoneCallback) {
  try {
    const objData: File = job.data;
    const objParams: NewObjectParamsDto = job.data.params;

    downloadParams.Key = objData.key;

    const file = s3.getObject(downloadParams).createReadStream();
    const filePath = join(process.cwd(), `/tmp/${objData.key}`);
    await fsAsync.writeFile(filePath, file);

    const processedFile = await sharp(filePath)
      .webp({ quality: +objParams.quality || 100 })
      .toBuffer();

    const fileName = objParams.originalname.split('.')[0];

    await fsAsync.writeFile(
      join(process.cwd(), `/tmp/converted-${objData.id}.${fileName}.webp`),
      processedFile,
    );

    const newObject = await File.create({
      status: 'initial',
      type: 'optimized',
      fileId: objData.id,
    });

    uploadParams.Key = `${newObject.id}.converted.${fileName}.webp`;
    uploadParams.Body = processedFile;

    s3.upload(uploadParams, (error: Error, data: any) => {
      if (error) doneCallback(error, null);
      else doneCallback(null, data);
    });
  } catch (error) {
    doneCallback(error, null);
  }
}

export default imageProcessor;
