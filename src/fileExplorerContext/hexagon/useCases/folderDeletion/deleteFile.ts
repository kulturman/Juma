import { BadRequestException } from '../../../../shared/hexagon/exceptions/badRequestException';
import { FileStorageGateway } from '../../gateways/fileStorageGateway';

export class DeleteFile {
  constructor(private readonly fileStorageGateway: FileStorageGateway) {}

  async handle(command: DeleteFileCommand) {
    const fileFullPath =
      this.fileStorageGateway.getBasePath(command.userId) +
      '/' +
      command.filePath;

    if (!(await this.fileStorageGateway.fileExists(fileFullPath))) {
      throw new BadRequestException('File does not exist');
    }
    this.fileStorageGateway.delete(command.userId, command.filePath);
  }
}

export interface DeleteFileCommand {
  filePath: string;
  userId: number;
}
