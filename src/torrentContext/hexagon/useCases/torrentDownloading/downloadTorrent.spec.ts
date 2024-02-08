import { AuthRepositoryStub } from '../../../../authContext/adapters/secondary/gateways/stubs/AuthRepositoryStub';
import { DownloadTorrent } from './downloadTorrent';
import { NotFoundException } from '../../../../sharedKernel/hexagon/exceptions/notFoundException';
import { TorrentStatus } from '../../torrent-status.enum';
import * as fs from 'fs';
import { TorrentRepositoryStub } from '../../../adapters/secondary/gateways/repositories/stubs/TorrentRepositoryStub';
import { TorrentClientStub } from '../../../adapters/secondary/gateways/stubs/TorrentClientStub';
import { FileSystemStorageGateway } from 'src/fileExplorerContext/adapters/secondary/gateways/fileStorage/fileSystemStorageGateway';

describe('Download torrent', () => {
  let torrentRepository: TorrentRepositoryStub;
  let userRepository: AuthRepositoryStub;
  let torrentClient: TorrentClientStub;
  let downloadTorrent: DownloadTorrent;
  let fileStorageGateway: FileSystemStorageGateway;
  let userBaseDirectory: string;

  beforeEach(() => {
    userRepository = new AuthRepositoryStub();
    torrentClient = new TorrentClientStub();
    torrentRepository = new TorrentRepositoryStub();
    fileStorageGateway = new FileSystemStorageGateway();
    userBaseDirectory = fileStorageGateway.getBasePath(1);

    downloadTorrent = new DownloadTorrent(
      torrentRepository,
      userRepository,
      torrentClient,
      fileStorageGateway,
    );
  });

  it('should not download torrent if user does not exist', () => {
    expect(async () => {
      await downloadTorrent.handle({
        userId: 1,
        filePath: userBaseDirectory,
        fileName: 'A torrent',
      });
    }).rejects.toThrow(NotFoundException);
  });

  it('should download torrent', async () => {
    const user = userRepository.addUser({
      fullname: 'Arnaud',
      password: '123456',
      email: 'ar@gmail.com',
    });

    await downloadTorrent.handle({
      userId: user.id,
      filePath: userBaseDirectory,
      fileName: 'A torrent',
    });

    const torrent = torrentRepository.findLastTorrent();

    expect(torrent).toMatchObject({
      status: TorrentStatus.COMPLETED,
      progression: 100,
    });

    expect(fs.existsSync(userBaseDirectory + '/' + torrent.torrentName)).toBe(
      true,
    );

    fs.rmSync(userBaseDirectory, {
      recursive: true,
    });
  });
});
