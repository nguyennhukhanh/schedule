import * as fs from 'fs';
import * as path from 'path';

const dir = path.join(__dirname, '../../../public', 'files');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

export const createDirs = true;
