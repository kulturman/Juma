import { Module } from '@nestjs/common';
import { FileExplorerController } from './file-explorer.controller';
import { FileExplorerService } from './file-explorer.service';

@Module({
    controllers: [FileExplorerController],
    providers: [FileExplorerService]
})
export class FileExplorerModule {}
