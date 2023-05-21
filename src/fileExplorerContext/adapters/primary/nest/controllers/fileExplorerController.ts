import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { RetrieveFolderContent } from '../../../../hexagon/useCases/folderContentRetrieval/retrieveFolderContent';
import { CreateFolder } from '../../../../hexagon/useCases/folderCreation/createFolder';
import { CopyFile } from '../../../../hexagon/useCases/folderCopying/copyFile';
import { DeleteFile } from '../../../../hexagon/useCases/folderDeletion/deleteFile';
import { DownloadFile } from '../../../../hexagon/useCases/fileDownloading/downloadFile';

@Controller('fs')
export class FileExplorerController {
  constructor(
    private readonly retrieveDirectoryContent: RetrieveFolderContent,
    private readonly createFolder: CreateFolder,
    private readonly copyFile: CopyFile,
    private readonly deleteFile: DeleteFile,
    private readonly downloadFile: DownloadFile,
  ) {}

  @Get('folder/:folderPath?')
  getFolderContent(@Req() req, @Param('folderPath') folderPath: string) {
    return this.retrieveDirectoryContent.handle(
      req.user.id as number,
      folderPath || '',
    );
  }
  @Post('folder/:folderPath?')
  async createDirectory(
    @Req() req,
    @Body('folderName') folderName: string,
    @Param('folderPath') folderPath: string,
  ) {
    await this.createFolder.handle({
      userId: req.user.id as number,
      path: folderPath || '',
      folderName,
    });
  }

  @Post('copy/:filePath')
  @HttpCode(200)
  async copyItem(@Req() req, @Body('destination') destination) {
    await this.copyFile.handle({
      userId: req.user.id as number,
      source: req.params.filePath,
      destination: destination,
    });
  }

  @Delete(':filePath')
  async deleteItem(@Req() req, @Param('filePath') filePath) {
    await this.deleteFile.handle({
      userId: req.user.id as number,
      filePath,
    });
  }

  @Get('file/download/:filePath')
  async download(@Req() req, @Res({ passthrough: true }) res) {
    const fileData = await this.downloadFile.handle({
      userId: req.user.id as number,
      filePath: req.params.filePath,
    });

    res.set({
      'Content-Disposition': `attachment; filename="${fileData.fileName}"`,
    });
    return new StreamableFile(fileData.file);
  }
}
