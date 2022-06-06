import * as fs from 'fs';

const exclusion: string[] = [
  'INVALID_HEADER',
  'SPACE_REPLACE_TAB',
  'SPACE_BEFORE_FUNC',
  'DECL_ASSIGN_LINE',
  'WRONG_SCOPE_COMMENT',
  'SPC_AFTER_POINTER',
  'SPACE_EMPTY_LINE',
  'MISALIGNED_VAR_DECL',
  'EMPTY_LINE_FUNCTION',
  'RETURN_PARENTHESIS',
  'TOO_MANY_VARS_FUNC',
  'NL_AFTER_VAR_DECL',
  'VAR_DECL_START_FUNC',
];

export async function err2json() {
  console.log('err');
  const report = fs.readFileSync('./norm-out/report.txt', 'utf8');
  const errJson = [];
  report.split('\n').forEach((line) => {
    if (line.includes('line')) {
      const err = line.split(':');
      if (line.includes('Unrecognized')) return;
      const err_json = {
        type: err[1].slice(0, -5).trim(),
        line: err[2].slice(0, -5).trim(),
        column: err[3].slice(0, -1).trim(),
        message: err[4].slice().trim(),
      };
      if (!exclusion.includes(err_json.type)) errJson.push(err_json);
    }
  });
  console.log(errJson);
  return errJson;
}
