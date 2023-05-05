import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { FileStorageGateway } from '../folderContentRetrieval/gateways/fileStorageGateway';

export class CreateFolder {
  constructor(
    @Inject('FileStorageGateway') private fileStorageGatway: FileStorageGateway,
  ) {}

  async handle(command: CreateFolderCommand) {
    const basePath = `${process.env.TORRENTS_STORAGE_PATH}/${command.userId}/${command.path}`;
    const newDirectoryPath = `${basePath}/${command.folderName}`;

    if (!(await this.fileStorageGatway.fileExists(basePath))) {
      throw new NotFoundException('Path not found');
    }

    if (await this.fileStorageGatway.fileExists(newDirectoryPath)) {
      throw new BadRequestException('Folder already exists');
    }
    this.fileStorageGatway.createFolder(newDirectoryPath);
  }
}

export interface CreateFolderCommand {
  userId: number;
  path: string;
  folderName: string;
}
