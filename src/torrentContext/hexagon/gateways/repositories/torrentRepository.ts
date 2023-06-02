import { Torrent } from '../../entities/torrent.entity';

export const TorrentRepositoryToken = Symbol('TorrentRepository');
export interface TorrentRepository {
  save(torrent: Torrent): Promise<Torrent>;
  findById(id: number): Promise<Torrent> | undefined;
}
