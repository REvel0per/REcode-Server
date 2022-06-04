import { Injectable } from '@nestjs/common';
import { promisify } from 'util';
import { writeFile } from 'fs';
import { fileDto } from './fileDto';
import * as fs from 'fs';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async createFile(file: fileDto) {
    console.log('test');
    console.log(file);
    const write = promisify(writeFile);
    await write(`./infer_test/${file.name}`, file.body);
  }

  async runInfer(filename: string) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const exec = require('child_process').exec;
    const infer_path = '~/Soyeon/infer/infer/bin/infer';
    const options = '--pulse';
    exec(`${infer_path} run ${options} -- clang -c ./infer_test/${filename}`);
  }

  async readResult() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const report = fs.readFileSync('./infer-out/report.json', 'utf8');
    return report;
  }
}
