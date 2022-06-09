import { Controller, Get, NotFoundException, Param, Req } from "@nestjs/common";
import { join } from "path";
import { FileExplorerService } from "./file-explorer.service";
import * as fs from 'fs';


@Controller('fs')
export class FileExplorerController {
    constructor(private readonly fileExplorerService: FileExplorerService) {}

    @Get('folder/:folderPath?')
    getFolderContent(@Req() req, @Param('folderPath') folderPath) {
        const directoryPath = join(__dirname, `../${req.user.id}`, folderPath ? folderPath: '');
        
        if (!fs.existsSync(directoryPath)) {
            throw new NotFoundException('Directory does not exist');
        }
        return this.fileExplorerService.getFolderContent(directoryPath);
    }
}