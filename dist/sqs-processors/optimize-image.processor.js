"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = require("aws-sdk");
const path_1 = require("path");
const fs = require("fs");
const fsAsync = require("fs/promises");
const sharp = require("sharp");
const file_model_1 = require("../common/models/file.model");
const worker_db_instance_1 = require("./worker-db-instance");
(async () => {
    await worker_db_instance_1.sequelize.sync();
})();
if (!fs.existsSync((0, path_1.join)(process.cwd(), `/tmp`))) {
    fs.mkdirSync((0, path_1.join)(process.cwd(), `/tmp`));
}
const s3 = new aws_sdk_1.S3();
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
async function imageProcessor(job, doneCallback) {
    try {
        const objData = job.data;
        const objParams = job.data.params;
        const obj = await file_model_1.File.findByPk(objData.id);
        downloadParams.Key = objData.key;
        const file = s3.getObject(downloadParams).createReadStream();
        const fileName = objParams.originalname.split('.')[0];
        const filePath = (0, path_1.join)(process.cwd(), `/tmp/${objData.key}`);
        await fsAsync.writeFile(filePath, file);
        const processedFile = sharp(filePath).webp({
            quality: +objParams.quality || 80,
        });
        if (objParams.resize) {
            const size = JSON.parse(objParams.size);
            processedFile.resize(+size.width, +size.height);
        }
        await processedFile.toBuffer();
        const newObject = await file_model_1.File.create({
            status: 'initial',
            type: 'optimized',
        });
        const newObjKey = `${newObject.id}.converted.${fileName}.webp`;
        uploadParams.Key = newObjKey;
        uploadParams.Body = processedFile;
        newObject.key = newObjKey;
        await newObject.save();
        obj.$add('processed_file', newObject);
        s3.upload(uploadParams, async (error, data) => {
            if (error) {
                newObject.status = 'failed';
                await newObject.save();
                doneCallback(error, null);
            }
            else {
                newObject.status = 'uploaded';
                await newObject.save();
                await fsAsync.unlink(filePath);
                doneCallback(null, data);
            }
        });
    }
    catch (error) {
        doneCallback(error, null);
    }
}
exports.default = imageProcessor;
//# sourceMappingURL=optimize-image.processor.js.map