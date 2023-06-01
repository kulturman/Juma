import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './authContext/adapters/primary/nest/authModule';
import { ConfigModule } from '@nestjs/config';
import { TorrentModule } from './torrentContext/adapters/primary/nest/torrent.module';
import { BullModule } from '@nestjs/bull';
import { FileExplorerModule } from './fileExplorerContext/adapters/primary/nest/fileExplorerModule';
import { typeOrmAsyncConfig } from './sharedKernel/adapters/primary/config/typeorm.config';

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
