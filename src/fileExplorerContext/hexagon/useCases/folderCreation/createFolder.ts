import { FileStorageGateway } from '../../gateways/fileStorageGateway';
import { NotFoundException } from '../../../../sharedKernel/hexagon/exceptions/notFoundException';
import { BadRequestException } from '../../../../sharedKernel/hexagon/exceptions/badRequestException';

export class CreateFolder {
  constructor(private fileStorageGatway: FileStorageGateway) {}

  async handle(command: CreateFolderCommand) {
    if (
      !(await this.fileStorageGatway.fileExists(command.userId, command.path))
    ) {
      throw new NotFoundException('Path not found');
    }

    const newDirectoryPath =
      command.path === ''
        ? command.folderName
        : command.path + '/' + command.folderName;

    if (
      await this.fileStorageGatway.fileExists(command.userId, newDirectoryPath)
    ) {
      throw new BadRequestException('Directory already exists');
    }

    await this.fileStorageGatway.createFolder(command.userId, newDirectoryPath);
  }
}

export interface CreateFolderCommand {
  userId: number;
  path: string;
  folderName: string;
}
