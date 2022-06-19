import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TorrentModule } from './torrent/torrent.module';
import { BullModule } from '@nestjs/bull';
import { FileExplorerModule } from './file-explorer/file-explorer.module';
import { typeOrmAsyncConfig } from './config/typeorm.config';

@Module({
  imports: [
    AuthModule,
    TorrentModule,
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    ConfigModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    FileExplorerModule,
  ],
  providers: [],
})
export class AppModule {}
