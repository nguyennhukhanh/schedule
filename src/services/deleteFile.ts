import fs from 'fs';
import path from 'path';

export default function deleteFile(fileName: string): void {
  const filePath = path.resolve(__dirname, '../../public/files/', fileName);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.info(`File ${fileName} has been deleted`);
  });
}
