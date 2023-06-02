import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../../../authContext/adapters/primary/nest/authModule';
import { DownloadTorrentProcessor } from './jobs/downloadTorrentProcessor';
import { Torrent } from '../../../hexagon/entities/torrent.entity';
import { TorrentController } from './controllers/torrentController';
import { TypeORMTorrentRepository } from '../../secondary/gateways/repositories/typeORMTorrentRepository';
import { DownloadTorrent } from '../../../hexagon/useCases/torrentDownloading/downloadTorrent';
import {
  TorrentRepository,
  TorrentRepositoryToken,
} from '../../../hexagon/gateways/repositories/torrentRepository';
import { AuthRepository } from '../../../../authContext/hexagon/gateways/repositories/authRepository';
import { TorrentClient } from '../../../hexagon/gateways/torrentClient';
import { WebTorrentClient } from '../../secondary/gateways/webTorrentClient';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Torrent]),
    BullModule.registerQueue({
      name: 'downloadTorrent',
      settings: { maxStalledCount: 0 },
    }),
  ],
  controllers: [TorrentController],
  providers: [
    DownloadTorrentProcessor,
    {
      provide: TorrentRepositoryToken,
      useClass: TypeORMTorrentRepository,
    },
    {
      provide: TorrentClient,
      useClass: WebTorrentClient,
    },
    {
      provide: DownloadTorrent,
      useFactory: (
        torrentRepository: TorrentRepository,
        userRepository: AuthRepository,
        torrentClient: TorrentClient,
      ) => {
        return new DownloadTorrent(
          torrentRepository,
          userRepository,
          torrentClient,
        );
      },
      inject: [TorrentRepositoryToken, 'AuthRepository', TorrentClient],
    },
  ],
})
export class TorrentModule {}
