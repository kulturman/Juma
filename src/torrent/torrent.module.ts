import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { DownloadTorrentProcessor } from './download-torrent.processor';
import { Torrent } from './entities/torrent.entity';
import { TorrentController } from './torrent.controller';
import { TorrentService } from './torrent.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Torrent]),
        AuthModule,
        BullModule.registerQueue({
            name: 'downloadTorrent',
            settings: { maxStalledCount: 0 }
        })
    ],
    controllers: [TorrentController],
    providers: [TorrentService, DownloadTorrentProcessor]
})
export class TorrentModule {}
