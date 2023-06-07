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
import { FileStorageGateway } from 'src/fileExplorerContext/hexagon/gateways/fileStorageGateway';
import { FileSystemStorageGateway } from 'src/fileExplorerContext/adapters/secondary/gateways/fileStorage/fileSystemStorageGateway';

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
      provide: 'FileStorageGateway',
      useClass: FileSystemStorageGateway,
    },
    {
      provide: DownloadTorrent,
      useFactory: (
        torrentRepository: TorrentRepository,
        userRepository: AuthRepository,
        torrentClient: TorrentClient,
        fileSystemStorage: FileStorageGateway,
      ) => {
        return new DownloadTorrent(
          torrentRepository,
          userRepository,
          torrentClient,
          fileSystemStorage,
        );
      },
      inject: [TorrentRepositoryToken, 'AuthRepository', TorrentClient, 'FileStorageGateway'],
    },
  ],
})
export class TorrentModule {}
