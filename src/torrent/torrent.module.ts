import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Torrent } from './entities/torrent.entity';
import { TorrentController } from './torrent.controller';
import { TorrentService } from './torrent.service';

@Module({
    imports: [TypeOrmModule.forFeature([Torrent]), AuthModule],
    controllers: [TorrentController],
    providers: [TorrentService]
})
export class TorrentModule {}
