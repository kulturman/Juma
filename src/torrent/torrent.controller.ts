import { InjectQueue } from '@nestjs/bull';
import {
  Controller,
  Get,
  Post,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Queue } from 'bull';
import { join } from 'path';
import { TorrentService } from './torrent.service';

@Controller('torrents')
export class TorrentController {
  constructor(
    private torrentService: TorrentService,
    @InjectQueue('downloadTorrent') private downloadTorrentQueue: Queue,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      dest: join(__dirname, '../uploads/torrents'),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req) {
    const torrentEntity = await this.torrentService.createNewTorrent(
      file.path,
      req.user.id,
      file.originalname,
    );

    await this.downloadTorrentQueue.add(
      {
        torrentId: torrentEntity.id,
        userId: req.user.id,
      },
      { removeOnComplete: true, removeOnFail: true },
    );
  }
}
