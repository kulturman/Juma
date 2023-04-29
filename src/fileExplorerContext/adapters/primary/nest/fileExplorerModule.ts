import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { preventDirectoryTraversalMiddleware } from './directoryTraversalPreventing.middleware';
import { FileExplorerController } from './controllers/fileExplorerController';
import { RetrieFolderContent } from 'src/fileExplorerContext/hexagon/useCases/folderContentRetrieval/retrieveFolderContent';
import { FileSystemStorageGateway } from '../../secondary/gateways/fileStorage/fileSystemStorageGateway';

@Module({
  controllers: [FileExplorerController],
  exports: ['FileStorageGateway'],
  providers: [
    RetrieFolderContent,
    {
      provide: 'FileStorageGateway',
      useClass: FileSystemStorageGateway,
    },
  ],
})
export class FileExplorerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(preventDirectoryTraversalMiddleware).forRoutes('fs');
  }
}
