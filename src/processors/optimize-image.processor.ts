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
  const fileData: File = job.data;
  downloadParams.Key = fileData.id;
  const objParams: NewObjectParamsDto = job.data.params;

  const file = await s3.getObject(downloadParams).promise();

  await fsAsync.writeFile(
    join(process.cwd(), `/tmp/${fileData.id}.jpg`),
    Buffer.from(file.Body.toString()),
  );

  const converted = await sharp(Buffer.from(file.Body.toString()))
    .webp({ quality: +objParams.quality || 100 })
    .toBuffer();

  await fsAsync.writeFile(
    join(process.cwd(), `/tmp/converted-${fileData.id}.webp`),
    converted,
  );

  const newObject = await File.create({ status: 'pending', type: 'optimised' });

  uploadParams.Key = newObject.id;
  uploadParams.Body = converted;

  s3.upload(uploadParams, (err, data) => {
    if (err) doneCallback(err, null);
    else doneCallback(null, data);
  });
}

export default imageProcessor;
