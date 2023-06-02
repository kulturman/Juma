import {
  TorrentClient,
  TorrentProgressionListener,
} from '../../../../hexagon/gateways/torrentClient';

export class TorrentClientStub implements TorrentClient {
  start(
    torrentFilePath: string,
    destination: string,
    eventListener: TorrentProgressionListener,
  ): void {
    eventListener.update({
      progress: 100,
    });
  }
}
