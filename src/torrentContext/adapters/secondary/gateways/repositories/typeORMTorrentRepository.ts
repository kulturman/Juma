import { TorrentRepository } from '../../../../hexagon/gateways/repositories/torrentRepository';
import { Torrent } from '../../../../hexagon/entities/torrent.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class TypeORMTorrentRepository implements TorrentRepository {
  constructor(
    @InjectRepository(Torrent) private torrentRepository: Repository<Torrent>,
  ) {}

  async save(torrent: Torrent): Promise<Torrent> {
    await this.torrentRepository.save(torrent);
    return torrent;
  }

  async findById(id: number): Promise<Torrent> | undefined {
    return await this.torrentRepository.findOne({ id });
  }
}
