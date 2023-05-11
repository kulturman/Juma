import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { preventDirectoryTraversalMiddleware } from './directoryTraversalPreventing.middleware';
import { FileExplorerController } from './controllers/fileExplorerController';
import { RetrieveFolderContent } from 'src/fileExplorerContext/hexagon/useCases/folderContentRetrieval/retrieveFolderContent';
import { FileSystemStorageGateway } from '../../secondary/gateways/fileStorage/fileSystemStorageGateway';
import { FileStorageGateway } from '../../../hexagon/useCases/folderContentRetrieval/gateways/fileStorageGateway';
import { CreateFolder } from '../../../hexagon/useCases/folderCreation/createFolder';

@Module({
  controllers: [FileExplorerController],
  providers: [
    {
      provide: CreateFolder,
      useFactory: (fileStorageGateway: FileStorageGateway) => {
        return new CreateFolder(fileStorageGateway);
      },
      inject: ['FileStorageGateway'],
    },
    {
      provide: RetrieveFolderContent,
      useFactory: (fileStorageGateway: FileStorageGateway) => {
        return new RetrieveFolderContent(fileStorageGateway);
      },
      inject: ['FileStorageGateway'],
    },
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
