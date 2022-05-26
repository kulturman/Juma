import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import connectionOptions from './ormconfig';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';


@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot(connectionOptions),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
  ],
  providers: [],
})
export class AppModule {}
