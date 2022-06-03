import { InjectQueue } from "@nestjs/bull";
import { Controller, Post, Request, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Queue } from "bull";
import { join } from "path";
import { UserRepository } from "src/auth/repositories/user.repository";
import { TorrentService } from "./torrent.service";

@Controller('torrents')
export class TorrentController {
    constructor(
        private torrentService: TorrentService,
        @InjectQueue('downloadTorrent') private downloadTorrentQueue: Queue 
    ) {}

    @Post()
    @UseInterceptors(FileInterceptor('file', {dest: join(__dirname, '../uploads/torrents')}))
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req) {
        const torrent = await this.torrentService.createNewTorrent(file.path, req.user.id);

        const job = await this.downloadTorrentQueue.add({
            'torrentId': torrent.id,
        }, { removeOnComplete: true, removeOnFail: true });
    }
}