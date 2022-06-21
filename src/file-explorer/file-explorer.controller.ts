import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { FileExplorerService } from './file-explorer.service';

@Controller('fs')
export class FileExplorerController {
  constructor(private readonly fileExplorerService: FileExplorerService) {}

  @Get('folder/:folderPath?')
  getFolderContent(@Req() req, @Param('folderPath') folderPath: string) {
    const basePath = `${process.env.TORRENTS_STORAGE_PATH}/${req.user.id}`;

    return this.fileExplorerService.getFolderContent(
      basePath,
      folderPath || '',
    );
  }

  @Post('folder/:folderPath?')
  createDirectory(
    @Req() req,
    @Body('folderName') folderName,
    @Param('folderPath') folderPath: string,
  ) {
    folderPath = folderPath ? folderPath : '';

    this.fileExplorerService.createDirectory(
      req.user.id,
      folderPath,
      folderName,
    );
  }

  @Get('file/download/:filePath')
  downloadFile(@Req() req, @Res({ passthrough: true }) res) {
    const fileData = this.fileExplorerService.getFileAsStream(
      req.user.id,
      req.params.filePath,
    );

    res.set({
      'Content-Disposition': `attachment; filename="${fileData.fileName}"`,
    });
    return new StreamableFile(fileData.file);
  }

  @Delete(':filePath')
  deleteItem(@Req() req, @Param('filePath') filePath) {
    this.fileExplorerService.deleteItem(req.user.id, filePath);
  }
}
