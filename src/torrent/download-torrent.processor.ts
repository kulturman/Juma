import { Process, Processor } from "@nestjs/bull";
import { InjectRepository } from "@nestjs/typeorm";
import { Job } from "bull";
import { Repository } from "typeorm";
import { Torrent } from "./entities/torrent.entity";
import { TorrentStatus } from "./torrent-status.enum";

@Processor('downloadTorrent')
export class DownloadTorrentProcessor {
    constructor(@InjectRepository(Torrent) private torrentRepository: Repository<Torrent>) {}
    
    @Process()
    async donwload(job: Job) {
        const torrent = await this.torrentRepository.findOne({id: job.data.torrentId});
        torrent.status = TorrentStatus.QUEUED;
        await this.torrentRepository.save(torrent);
    }
}