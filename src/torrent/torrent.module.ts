import { Module } from '@nestjs/common';
import { TorrentController } from './torrent.controller';

@Module({
    controllers: [TorrentController]
})
export class TorrentModule {}
