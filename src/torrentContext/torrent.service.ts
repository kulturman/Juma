import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../authContext/hexagon/entities/user.entity';
import { Repository } from 'typeorm';
import { Torrent } from './hexagon/entities/torrent.entity';

@Injectable()
export class TorrentService {
  constructor(
    @InjectRepository(Torrent)
    private torrentRepository: Repository<Torrent>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createNewTorrent(path: string, userId: number, torrentName: string) {
    const user = await this.userRepository.findOne({ id: userId });
    const torrent = new Torrent(user, path, torrentName);
    await this.torrentRepository.save(torrent);
    return torrent;
  }
}
