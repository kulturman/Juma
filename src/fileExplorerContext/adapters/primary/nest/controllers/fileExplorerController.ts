import { Controller, Get, Param, Req } from '@nestjs/common';
import { RetrieFolderContent } from 'src/fileExplorerContext/hexagon/useCases/folderContentRetrieval/retrieveFolderContent';

@Controller('fs')
export class FileExplorerController {
  constructor(private readonly retrieveDirectoryContent: RetrieFolderContent) {}

  @Get('folder/:folderPath?')
  getFolderContent(@Req() req, @Param('folderPath') folderPath: string) {
    const basePath = `${process.env.TORRENTS_STORAGE_PATH}/${req.user.id}`;

    return this.retrieveDirectoryContent.handle(basePath, folderPath || '');
  }
}
