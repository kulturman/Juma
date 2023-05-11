import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { RetrieveFolderContent } from 'src/fileExplorerContext/hexagon/useCases/folderContentRetrieval/retrieveFolderContent';
import { CreateFolder } from '../../../../hexagon/useCases/folderCreation/createFolder';

@Controller('fs')
export class FileExplorerController {
  constructor(
    private readonly retrieveDirectoryContent: RetrieveFolderContent,
    private readonly createFolder: CreateFolder,
  ) {}

  @Get('folder/:folderPath?')
  getFolderContent(@Req() req, @Param('folderPath') folderPath: string) {
    const basePath = `${process.env.TORRENTS_STORAGE_PATH}/${req.user.id}`;

    return this.retrieveDirectoryContent.handle(basePath, folderPath || '');
  }
  @Post('folder/:folderPath?')
  async createDirectory(
    @Req() req,
    @Body('folderName') folderName,
    @Param('folderPath') folderPath: string,
  ) {
    folderPath = folderPath ? folderPath : '';

    await this.createFolder.handle({
      userId: req.user.id as number,
      path: folderPath,
      folderName,
    });
  }
}
