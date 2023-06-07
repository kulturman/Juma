import { AuthRepository } from '../../../../authContext/hexagon/gateways/repositories/authRepository';
import { NotFoundException } from '../../../../sharedKernel/hexagon/exceptions/notFoundException';
import { Torrent } from '../../entities/torrent.entity';
import { TorrentRepository } from '../../gateways/repositories/torrentRepository';
import { TorrentStatus } from '../../torrent-status.enum';
import * as fs from 'fs';
import { User } from '../../../../authContext/hexagon/entities/user.entity';
import {
  TorrentClient,
  TorrentData,
  TorrentProgressionListener,
} from '../../gateways/torrentClient';
import { FileStorageGateway } from 'src/fileExplorerContext/hexagon/gateways/fileStorageGateway';

export class DownloadTorrent implements TorrentProgressionListener {
  private torrentEntity: Torrent;

  constructor(
    private readonly torrentRepository: TorrentRepository,
    private readonly userRepository: AuthRepository,
    private readonly torrentClient: TorrentClient,
    private readonly fileSystemStorage: FileStorageGateway,
  ) {}

  async handle(command: DonwloadTorrentCommand) {
    const user: User = await this.userRepository.find(command.userId);

    if (user === undefined) {
      throw new NotFoundException('User does not exist');
    }

    this.torrentEntity = await this.torrentRepository.save(
      new Torrent(user, command.filePath, command.fileName),
    );

    this.torrentEntity.startTorrent();
    await this.torrentRepository.save(this.torrentEntity);

    const newTorrentDirectory =
      this.fileSystemStorage.getBasePath(user.id) +
      '/' +
      this.torrentEntity.torrentName;
    fs.mkdirSync(newTorrentDirectory, { recursive: true });

    this.torrentClient.start(
      this.torrentEntity.path,
      newTorrentDirectory,
      this,
    );
  }

  async update(torrent: TorrentData): Promise<void> {
    const progression = torrent.progress > 100 ? 100 : torrent.progress;
    this.torrentEntity.progression = progression;

    if (progression === 100) {
      this.torrentEntity.status = TorrentStatus.COMPLETED;
    }
    await this.torrentRepository.save(this.torrentEntity);
  }
}

export interface DonwloadTorrentCommand {
  userId: number;
  fileName: string;
  filePath: string;
}
