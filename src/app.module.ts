import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import connectionOptions from './ormconfig';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { ConfigModule } from '@nestjs/config';
import { TorrentModule } from './torrent/torrent.module';
import { BullModule } from '@nestjs/bull';


@Module({
  imports: [
    AuthModule,
    TorrentModule,
    TypeOrmModule.forRoot(connectionOptions),
    ConfigModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379
      }
    })
  ],
  providers: [],
})
export class AppModule {}
