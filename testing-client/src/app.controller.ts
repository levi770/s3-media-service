import {
  Controller,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { GetUploadUrlDto } from './dto/getUploadUrl.dto';
import * as fs from 'fs/promises';
import axios from 'axios';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/uploadFile')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query() query?: GetUploadUrlDto,
  ) {
    try {
      const uploadUrl: any = await this.appService.getUploadUrl({
        fileType: file.mimetype,
        ...query,
      });
      const fileBlob = await fs.readFile(file.path);

      const axiosResponse = await axios.put(
        uploadUrl,
        {
          data: fileBlob,
        },
        {
          headers: {
            'Content-Type': file.mimetype,
          },
        },
      );
      return axiosResponse.data;
    } catch (error) {
      return error;
    }
  }
}
