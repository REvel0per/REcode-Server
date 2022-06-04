import {
  Body,
  Controller,
  Get,
  Header,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { fileDto } from './fileDto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiBody({ type: fileDto })
  @Post('test')
  @Header('content-type', 'application/json')
  async inferC(@Body() fileDto: fileDto) {
    console.log(fileDto.name);
    await this.appService.createFile(fileDto);
    await this.appService.runInfer(fileDto.name);
  }

  @Post('infer')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'name', maxCount: 1 },
      { name: 'body', maxCount: 1 },
    ]),
  )
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        body: { type: 'string' },
      },
    },
  })
  async infer(@Body() fileDto: fileDto) {
    console.log(fileDto);
    await this.appService.createFile(fileDto);
    await this.appService.runInfer(fileDto.name);
    const report = await this.appService.readResult();

    return Object.assign({
      ok: 200,
      status: 'OK',
      body: {
        files: [
          {
            filename: fileDto.name,
            bug: report,
          },
        ],
      },
    });
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
