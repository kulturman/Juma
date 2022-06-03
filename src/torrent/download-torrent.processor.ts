import { Process, Processor } from "@nestjs/bull";
import { InjectRepository } from "@nestjs/typeorm";
import { Job } from "bull";
import { join } from "path";
import { Repository } from "typeorm";
import { Torrent } from "./entities/torrent.entity";
import { TorrentStatus } from "./torrent-status.enum";
const WebTorrent = require('webtorrent')

@Processor('downloadTorrent')
export class DownloadTorrentProcessor {
    constructor(@InjectRepository(Torrent) private torrentRepository: Repository<Torrent>) {}
    
    @Process()
    async donwload(job: Job) {
        const torrentEntity = await this.torrentRepository.findOne({id: job.data.torrentId});
        torrentEntity.status = TorrentStatus.STARTED;
        const repository = this.torrentRepository;
        await this.torrentRepository.save(torrentEntity);
        const client = new WebTorrent()

        client.add(
            torrentEntity.path,
            {path: join(__dirname , '../')},
            torrent => {
                let interval = setInterval(async () => {
                    torrentEntity.progression = torrent.progress * 100;
                    await repository.save(torrentEntity);
                }, 5000);

                torrent.on('done', async () => {
                    torrentEntity.progression = 100;
                    torrentEntity.status = TorrentStatus.COMPLETED;
                    clearInterval(interval);
                    await repository.save(torrentEntity);
                })
            }
        );
    }
}