import { FileStorageGateway } from '../../gateways/fileStorageGateway';
import * as fs from 'fs';

export class DownloadFile {
  constructor(private readonly fileStorageGateway: FileStorageGateway) {}
  async handle(command: DownloadFileCommand): Promise<{
    file: fs.ReadStream;
    fileName: string;
  }> {
    return this.fileStorageGateway.getFileAsStream(
      command.userId,
      command.filePath,
    );
  }
}

export class DownloadFileCommand {
  userId: number;
  filePath: string;
}
