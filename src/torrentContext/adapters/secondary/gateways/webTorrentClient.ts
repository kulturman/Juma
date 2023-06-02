import {
  TorrentClient,
  TorrentProgressionListener,
} from '../../../hexagon/gateways/torrentClient';
import * as WebTorrent from 'webtorrent';

export class WebTorrentClient implements TorrentClient {
  start(
    torrentFilePath: string,
    destination: string,
    eventListener: TorrentProgressionListener,
  ) {
    const client = new WebTorrent();

    client.add(torrentFilePath, { path: destination }, (torrent) => {
      const interval = setInterval(async () => {
        const progression = torrent.progress * 100;

        if (progression >= 100) {
          clearInterval(interval);
        }

        await eventListener.update({
          progress: progression,
        });
      }, 5000);
    });
  }
}
