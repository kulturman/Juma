import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import path from "path/posix";
import { UserRepository } from "src/auth/repositories/user.repository";
import { Repository } from "typeorm";
import { Torrent } from "./entities/torrent.entity";

@Injectable()
export class TorrentService {
    constructor(
        @InjectRepository(Torrent) private torrentRepository: Repository<Torrent>,
        private userRepository: UserRepository
    ) {}

    async createNewTorrent(path: string, userId: number) {
        const user = await this.userRepository.findOne({ id: userId });
        const torrent = new Torrent(user, path);
        this.torrentRepository.save(torrent);
        return user;
    }
}