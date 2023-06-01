import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import * as process from 'process';
import { config } from 'dotenv';
import { uuid } from 'uuidv4';
config();
export const multerConfig: MulterOptions = {
  storage: diskStorage({
    destination: process.env.TORRENTS_STORAGE_PATH as string,
    filename: (req, file, cb) => {
      const filename = uuid();
      const extension: string = file.originalname.split('.').pop();
      cb(null, `${filename}.${extension}`);
    },
  }),
};
