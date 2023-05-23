import {
  DirectoryContent,
  DirectoryEntity,
} from '../../../../../hexagon/useCases/folderContentRetrieval/directoryContent';
import { FileStorageGateway } from '../../../../../hexagon/gateways/fileStorageGateway';
import fs from 'fs';
import { EitherAsync, Right } from 'purify-ts';

export class FileStorageGatewayStub implements FileStorageGateway {
  private _directoryContent: DirectoryContent = { children: [] };
  public existingDirectoryItems: string[] = [];

  getDirectoryContent(
    userId: number,
    path: string,
  ): EitherAsync<Error, DirectoryContent> {
    return EitherAsync.liftEither(Right(this._directoryContent));
  }

  async doesFileExist(userId: number, path: string): Promise<boolean> {
    let fullPath = this.getBasePath(userId);

    if (path !== '') {
      fullPath += '/' + path;
    }
    return this.existingDirectoryItems.includes(fullPath);
  }

  set directoryContent(value: DirectoryContent) {
    this._directoryContent = value;
  }

  addItems(...items: DirectoryEntity[]) {
    this._directoryContent.children.push(...items);
  }
  createFolder(userId: number, filePath: string): void {
    this.existingDirectoryItems.push(this.getBasePath(userId) + '/' + filePath);
  }

  copy(userId: number, source: string, destination: string): void {
    this.existingDirectoryItems.push(
      this.getBasePath(userId) + '/' + destination,
    );
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
