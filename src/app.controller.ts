import {
  Body,
  Controller,
  Get,
  Header,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { fileDto } from './file.dto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiBody({ type: fileDto })
  @Post('infer')
  @Header('content-type', 'application/json')
  async inferC(@Body() body: fileDto) {
    console.log(body);
    await this.appService.createFile(body);
  }

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          // 👈 this property
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async upload(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }

  @Get('get/test')
  @Header('content-type', 'application/json')
  async getFileDiagnostic() {
    return this.appService.getFileDiagnostic();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // // TODO
  // // add @UploadedFiles() files
  // @Post('upload')
  // @UseInterceptors(AnyFilesInterceptor())
  // uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
  //   return this.appService.createFile(files);
  // }
}
