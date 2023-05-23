import { BadRequestException } from '../../../../shared-kernel/hexagon/exceptions/badRequestException';
import { FileStorageGateway } from '../../gateways/fileStorageGateway';
import * as path from 'path';

export class CopyFile {
  constructor(private fileStorageGateway: FileStorageGateway) {}

  async handle(command: CopyFileCommand) {
    const fileName = path.basename(command.source);
    if (
      !(await this.fileStorageGateway.doesFileExist(
        command.userId,
        command.source,
      ))
    ) {
      throw new BadRequestException('File or directory does not exist');
    }

    if (
      await this.fileStorageGateway.doesFileExist(
        command.userId,
        command.destination === ''
          ? fileName
          : command.destination + '/' + fileName,
      )
    ) {
      throw new BadRequestException('File or directory already exists');
    }

    await this.fileStorageGateway.copy(
      command.userId,
      command.source,
      command.destination === ''
        ? fileName
        : command.destination + '/' + fileName,
    );
  }
}
export class CopyFileCommand {
  userId: number;
  destination: string;
  source: string;
}
