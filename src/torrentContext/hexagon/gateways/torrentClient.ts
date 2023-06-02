export interface TorrentClient {
  start(
    torrentFilePath: string,
    destination: string,
    eventListener: TorrentProgressionListener,
  ): void;
}

export const TorrentClient = Symbol('TorrentClient');
export interface TorrentData {
  progress: number;
}

export interface TorrentProgressionListener {
  update(torrentData: TorrentData): Promise<void>;
}
