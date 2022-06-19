import { Body, Controller, ForbiddenException, Get, Param, Post, Req, Res, StreamableFile } from "@nestjs/common";
import { FileExplorerService } from "./file-explorer.service";

@Controller('fs')
export class FileExplorerController {
    constructor(private readonly fileExplorerService: FileExplorerService) {}

    @Get('folder/:folderPath?')
    getFolderContent(@Req() req, @Param('folderPath') folderPath: string) {
        const basePath = `${process.env.TORRENTS_STORAGE_PATH}/${req.user.id}`;

        if (folderPath && folderPath.includes('..')) {
            throw new ForbiddenException('Nice try, cannot let you explore directories like that');
        }
        return this.fileExplorerService.getFolderContent(basePath, folderPath || '');
    }

    @Post('folder/:folderPath?')
    createDirectory(@Req() req, @Body('folderName') folderName, @Param('folderPath') folderPath: string) {
        folderPath = folderPath ? folderPath: '';
        
        if (folderPath.includes('..')) {
            throw new ForbiddenException('Nice try, cannot let you explore directories like that');
        }

        this.fileExplorerService.createDirectory(req.user.id, folderPath, folderName);
    }

    @Get('file/download/:filePath')
    downloadFile(@Req() req, @Res({ passthrough: true }) res) {
        const fileData = this.fileExplorerService.getFileAsStream(req.user.id, req.params.filePath);
        
        res.set({
            'Content-Disposition': `attachment; filename="${fileData.fileName}"`,
        });
        return new StreamableFile(fileData.file);
    }

}

