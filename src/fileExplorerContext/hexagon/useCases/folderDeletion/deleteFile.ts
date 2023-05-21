import { BadRequestException } from '../../../../shared/hexagon/exceptions/badRequestException';
import { FileStorageGateway } from '../../gateways/fileStorageGateway';

export class DeleteFile {
  constructor(private readonly fileStorageGateway: FileStorageGateway) {}

  async handle(command: DeleteFileCommand) {
    if (
      !(await this.fileStorageGateway.fileExists(
        command.userId,
        command.filePath,
      ))
    ) {
      throw new BadRequestException('File does not exist');
    }
    this.fileStorageGateway.delete(command.userId, command.filePath);
  }
}

export interface DeleteFileCommand {
  filePath: string;
  userId: number;
}
