import {
  Controller,
  HttpService,
  Get,
  Param,
  Post,
  Body,
  Req,
  Put,
  Res,
  ConsoleLogger,
  UploadedFiles,
} from '@nestjs/common';
import { FileService } from './file.service';
import { query, Request, Response } from 'express';
import { ConfigService } from '../config/config.service';
import {
  ApiBody,
  ApiHeader,
  ApiPayloadTooLargeResponse,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
var fs = require('fs');

@Controller('file')
export class FileController {
  private ruta: string;
  constructor(
    private readonly FileService: FileService,
    private readonly ConfigService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  @Post('')
  async createDocumentClosure(@Req() req: any, @Res() res: Response) {
    try {
      const files = req.files.files;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        let name = file.name;
        let archivo = fs.readFileSync(file.tempFilePath);
        const buff = Buffer.from(archivo);
      }
      /* const fileTs = fs.readFileSync(file.tempFilePath);
      const buff = Buffer.from(fileTs);
      const data2 = Buffer.from(file.data);
      const name = file.name;
      const id = await this.FileService.fileUpload(buff, name);*/
    } catch (error) {
      //console.log(error);
      return res
        .status(500)
        .json({ statusCode: 500, description: 'Internal server error' });
    }
  }
}
