import { InjectQueue } from '@nestjs/bull';
import {
  Controller,
  Post,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Queue } from 'bull';
import { multerConfig } from '../multerConfig';
import { DownloadTorrent } from '../../../../hexagon/useCases/torrentDownloading/downloadTorrent';

@Controller('torrents')
export class TorrentController {
  constructor(
    private readonly downloadTorrent: DownloadTorrent,
    @InjectQueue('downloadTorrent') private downloadTorrentQueue: Queue,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req) {
    await this.downloadTorrentQueue.add(
      {
        userId: req.user.id,
        fileName: file.originalname,
        filePath: file.path,
      },
      { removeOnComplete: true, removeOnFail: true },
    );
  }
}
