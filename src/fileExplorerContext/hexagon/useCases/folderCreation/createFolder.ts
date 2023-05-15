import { FileStorageGateway } from '../../gateways/fileStorageGateway';
import { NotFoundException } from '../../../../shared/hexagon/exceptions/notFoundException';
import { BadRequestException } from '../../../../shared/hexagon/exceptions/badRequestException';

export class CreateFolder {
  constructor(private fileStorageGatway: FileStorageGateway) {}

  async handle(command: CreateFolderCommand) {
    const basePath = `${command.basePath}${command.path !== '' ? '/' : ''}${
      command.path
    }`;

    if (!(await this.fileStorageGatway.fileExists(basePath))) {
      throw new NotFoundException('Path not found');
    }

    const newDirectoryPath = `${basePath}/${command.folderName}`;

    if (await this.fileStorageGatway.fileExists(newDirectoryPath)) {
      throw new BadRequestException('Directory already exists');
    }

    await this.fileStorageGatway.createFolder(newDirectoryPath);
  }
}

export interface CreateFolderCommand {
  basePath: string;
  path: string;
  folderName: string;
}
