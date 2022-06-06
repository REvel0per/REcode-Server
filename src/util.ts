import * as fs from 'fs';

export async function err2json() {
  console.log('err');
  const report = fs.readFileSync('./norm-out/report.txt', 'utf8');
  const errJson = [];
  report.split('\n').forEach((line) => {
    if (line.includes('line')) {
      const err = line.split(':');
      const err_json = {
        type: err[1].slice(0, -5).trim(),
        line: err[2].slice(0, -5).trim(),
        column: err[3].slice(0, -1).trim(),
        message: err[4].slice().trim(),
      };
      if (err_json.type !== 'INVALID_HEADER') errJson.push(err_json);
    }
  });
  console.log(errJson);
  return errJson;
}
