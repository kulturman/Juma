import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "src/auth/repositories/user.repository";
import { Repository } from "typeorm";
import { Torrent } from "./entities/torrent.entity";

@Injectable()
export class TorrentService {
    constructor(
        @InjectRepository(Torrent) private torrentRepository: Repository<Torrent>,
        private userRepository: UserRepository
    ) {}

    async createNewTorrent(path: string, userId: number, torrentName: string) {
        const user = await this.userRepository.findOne({ id: userId });
        const torrent = new Torrent(user, path, torrentName);
        await this.torrentRepository.save(torrent);
        return torrent;
    }
}