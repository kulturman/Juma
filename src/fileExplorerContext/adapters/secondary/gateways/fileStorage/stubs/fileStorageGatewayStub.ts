import {
  DirectoryContent,
  DirectoryEntity,
} from '../../../../../hexagon/useCases/folderContentRetrieval/directoryContent';
import { FileStorageGateway } from '../../../../../hexagon/gateways/fileStorageGateway';

export class FileStorageGatewayStub implements FileStorageGateway {
  private _directoryContent: DirectoryContent = { children: [] };
  public existingDirectoryItems: string[] = [];

  async getDirectoryContent(path: string): Promise<DirectoryContent> {
    return this._directoryContent;
  }

  async fileExists(path: string): Promise<boolean> {
    return this.existingDirectoryItems.includes(path);
  }

  set directoryContent(value: DirectoryContent) {
    this._directoryContent = value;
  }

  addItems(...items: DirectoryEntity[]) {
    this._directoryContent.children.push(...items);
  }
  createFolder(filePath: string): void {
    this.existingDirectoryItems.push(filePath);
  }

  copy(source: string, destination: string): void {
    this.existingDirectoryItems.push(destination);
  }
}
