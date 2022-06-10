import { Controller, ForbiddenException, Get, NotFoundException, Param, Req } from "@nestjs/common";
import { join } from "path";
import { FileExplorerService } from "./file-explorer.service";

@Controller('fs')
export class FileExplorerController {
    constructor(private readonly fileExplorerService: FileExplorerService) {}

    @Get('folder/:folderPath?')
    getFolderContent(@Req() req, @Param('folderPath') folderPath: string) {
        const basePath = join(__dirname, `../${req.user.id}`);

        if (folderPath && folderPath.includes('..')) {
            throw new ForbiddenException('Nice try, cannot let you explore directories like that');
        }
        return this.fileExplorerService.getFolderContent(basePath, folderPath || '');
    }
}