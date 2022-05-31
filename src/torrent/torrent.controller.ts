import { Controller, Post, Request, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { TorrentService } from "./torrent.service";

@Controller('torrents')
export class TorrentController {
    constructor(private torrentService: TorrentService) {}

    @Post()
    @UseInterceptors(FileInterceptor('file', {dest: 'uploads/torrents'}))
    uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req) {
        this.torrentService.createNewTorrent(file.path, req.user.id);
    }
}