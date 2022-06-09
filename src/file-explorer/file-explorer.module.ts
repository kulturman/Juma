import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileExplorerController } from './file-explorer.controller';
import { FileExplorerService } from './file-explorer.service';

@Module({
    controllers: [FileExplorerController],
    providers: [FileExplorerService]
})
export class FileExplorerModule {}
