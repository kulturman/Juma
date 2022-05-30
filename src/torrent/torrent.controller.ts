import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('torrents')
export class TorrentController {
    @Post()
    @UseInterceptors(FileInterceptor('file', {dest: 'uploads/torrents'}))
    uploadFile(@UploadedFile() file: Express.Multer.File) {

    }
}