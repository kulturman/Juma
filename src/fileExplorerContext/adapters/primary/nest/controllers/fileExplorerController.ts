import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { RetrieveFolderContent } from '../../../../hexagon/useCases/folderContentRetrieval/retrieveFolderContent';
import { CreateFolder } from '../../../../hexagon/useCases/folderCreation/createFolder';
import { CopyFile } from '../../../../hexagon/useCases/folderCopying/copyFile';

@Controller('fs')
export class FileExplorerController {
  constructor(
    private readonly retrieveDirectoryContent: RetrieveFolderContent,
    private readonly createFolder: CreateFolder,
    private readonly copyFile: CopyFile,
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
    const basePath =
      `${process.env.TORRENTS_STORAGE_PATH}/${req.user.id}` as string;
    folderPath = folderPath ? folderPath : '';

    await this.createFolder.handle({
      basePath,
      path: folderPath,
      folderName,
    });
  }

  @Post('copy/:filePath')
  @HttpCode(200)
  async copyItem(@Req() req, @Body('destination') destination) {
    const basePath =
      `${process.env.TORRENTS_STORAGE_PATH}/${req.user.id}` as string;
    await this.copyFile.handle({
      source: basePath + '/' + req.params.filePath,
      destination: basePath + '/' + destination,
    });
  }
}
