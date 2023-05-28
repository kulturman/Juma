import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../authContext/hexagon/entities/user.entity';
import { AuthModule } from '../authContext/adapters/primary/nest/authModule';
import { DownloadTorrentProcessor } from './download-torrent.processor';
import { Torrent } from './entities/torrent.entity';
import { TorrentController } from './torrent.controller';
import { TorrentService } from './torrent.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Torrent, User]),
    AuthModule,
    BullModule.registerQueue({
      name: 'downloadTorrent',
      settings: { maxStalledCount: 0 },
    }),
  ],
  controllers: [TorrentController],
  providers: [TorrentService, DownloadTorrentProcessor],
})
export class TorrentModule {}
