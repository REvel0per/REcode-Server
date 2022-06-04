import { Injectable } from '@nestjs/common';
import { promisify } from 'util';
import { writeFile } from 'fs';
import { fileDto } from './file.dto';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async createFile(file: fileDto) {
    console.log('testing...');
    console.log(file);
    const write = promisify(writeFile);
    await write(`./infer_test/${file.name}`, file.body);
    await this.runInfer(file.name);
  }

  async runInfer(filename: string) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const exec = require('child_process').exec;
    const infer_path = '~/Soyeon/infer/infer/bin/infer';
    exec(`${infer_path} run -- clang -c ${filename}`);
  }

  async getFileDiagnostic() {
    return {
      ok: 200,
      status: 'OK',
      body: {
        files: [
          {
            filename: 'test.c',
            bug: [
              {
                bug_type: 'NULLPTR_DEREFERENCE',
                qualifier:
                  '`ptr` could be null (last assigned on line 5) and is dereferenced.',
                severity: 'ERROR',
                line: 6,
                column: 2,
                procedure: 'main',
                procedure_start_line: 3,
                // file: 'dangling_pointer_dereference.c',
                // key: 'dangling_pointer_dereference.c|main|NULLPTR_DEREFERENCE',
                // hash: 'd563507661b33f7dfa1c74405da808bb',
                bug_type_hum: 'Null Dereference',
              },
              {
                bug_type: 'USE_AFTER_FREE',
                qualifier:
                  'accessing memory that was invalidated by call to `free()` on line 8.',
                severity: 'ERROR',
                line: 10,
                column: 9,
                procedure: 'main',
                procedure_start_line: 3,
                // file: 'dangling_pointer_dereference.c',
                // key: 'dangling_pointer_dereference.c|main|USE_AFTER_FREE',
                // hash: '5ff65ada837421059b28686ce4422782',
                bug_type_hum: 'Use After Free',
              },
            ],
          },
        ],
      },
    };
  }
}
