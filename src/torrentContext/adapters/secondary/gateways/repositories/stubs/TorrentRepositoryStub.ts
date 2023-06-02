import { TorrentRepository } from '../../../../../hexagon/gateways/repositories/torrentRepository';
import { Torrent } from '../../../../../hexagon/entities/torrent.entity';

export class TorrentRepositoryStub implements TorrentRepository {
  private torrents: Torrent[] = [];
  findById(id: number): Promise<Torrent> | undefined {
    return Promise.resolve(undefined);
  }

  findLastTorrent(): Torrent | undefined {
    return this.torrents[this.torrents.length - 1];
  }

  save(torrent: Torrent): Promise<Torrent> {
    this.torrents.push(torrent);
    return Promise.resolve(torrent);
  }
}
