import { BadRequestException } from '../../../../shared/hexagon/exceptions/badRequestException';
import { FileStorageGateway } from '../../gateways/fileStorageGateway';
import * as path from 'path';

export class CopyFile {
  constructor(private fileStorageGateway: FileStorageGateway) {}

  async handle(copyFileCommand: CopyFileCommand) {
    const fileName = path.basename(copyFileCommand.source);
    if (!(await this.fileStorageGateway.fileExists(copyFileCommand.source))) {
      throw new BadRequestException('File or directory does not exist');
    }

    if (
      await this.fileStorageGateway.fileExists(
        copyFileCommand.destination + '/' + fileName,
      )
    ) {
      throw new BadRequestException('File or directory already exists');
    }

    await this.fileStorageGateway.copy(
      copyFileCommand.source,
      copyFileCommand.destination,
    );
  }
}
export class CopyFileCommand {
  destination: string;
  source: string;
}
