import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { preventDirectoryTraversalMiddleware } from './directory-traversal-preventing.middleware';
import { FileExplorerController } from './file-explorer.controller';
import { FileExplorerService } from './file-explorer.service';

@Module({
  controllers: [FileExplorerController],
  providers: [FileExplorerService],
})
export class FileExplorerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(preventDirectoryTraversalMiddleware).forRoutes('fs');
  }
}
