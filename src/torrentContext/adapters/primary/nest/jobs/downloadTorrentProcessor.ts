import { Process, Processor } from '@nestjs/bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bull';
import { Torrent } from '../../../../hexagon/entities/torrent.entity';
import {
  DonwloadTorrentCommand,
  DownloadTorrent,
} from '../../../../hexagon/useCases/torrentDownloading/downloadTorrent';

@Processor('downloadTorrent')
export class DownloadTorrentProcessor {
  constructor(
    @InjectRepository(Torrent)
    private readonly downloadTorrent: DownloadTorrent,
  ) {}

  @Process()
  async download(job: Job) {
    const data = job.data as DonwloadTorrentCommand;
    await this.downloadTorrent.handle(data);
  }
}
