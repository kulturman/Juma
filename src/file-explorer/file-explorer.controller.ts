import { Controller, Get, NotFoundException, Param, Req } from "@nestjs/common";
import { join } from "path";
import { FileExplorerService } from "./file-explorer.service";
import * as fs from 'fs';


@Controller('fs')
export class FileExplorerController {
    constructor(private readonly fileExplorerService: FileExplorerService) {}

    @Get('folder/:folderPath?')
    getFolderContent(@Req() req, @Param('folderPath') folderPath) {
        const basePath = join(__dirname, `../${req.user.id}`);

        return this.fileExplorerService.getFolderContent(basePath, folderPath || '');
    }
}