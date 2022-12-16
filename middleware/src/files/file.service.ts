import { Injectable, HttpService } from '@nestjs/common';

@Injectable()
export class FileService {
  constructor(private readonly httpService: HttpService) {}

  public async fileUpload(buff: any, name: any) {
    try {
      const typeFile = name.split('.')[1];
      // console.log(buff.data);
    } catch (error) {
      console.log(error);
      return 'error';
    }
  }
}
