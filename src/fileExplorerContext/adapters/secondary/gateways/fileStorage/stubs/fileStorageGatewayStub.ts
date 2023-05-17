import {
  DirectoryContent,
  DirectoryEntity,
} from '../../../../../hexagon/useCases/folderContentRetrieval/directoryContent';
import { FileStorageGateway } from '../../../../../hexagon/gateways/fileStorageGateway';
import fs from 'fs';

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

  getBasePath(id: number) {
    return `/home/${id}`;
  }

  createBasePath(id: number) {
    this.existingDirectoryItems.push(this.getBasePath(id));
  }

  delete(userId: number, fileToDelete: string): void {
    const index = this.existingDirectoryItems.findIndex(
      (item) => item === this.getBasePath(userId) + '/' + fileToDelete,
    );
    this.existingDirectoryItems.splice(index, 1);
  }

  getFileAsStream(
    userId: number,
    filePath: string,
  ): { file: fs.ReadStream; fileName: string } {
    return { file: undefined, fileName: '' };
  }
}
