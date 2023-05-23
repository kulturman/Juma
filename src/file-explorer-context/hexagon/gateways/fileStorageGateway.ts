import { DirectoryContent } from 'src/file-explorer-context/hexagon/useCases/folderContentRetrieval/directoryContent';
import fs from 'fs';
import { EitherAsync } from 'purify-ts';

export interface FileStorageGateway {
  doesFileExist(userId: number, path: string): Promise<boolean>;
  getDirectoryContent(
    userId: number,
    path: string,
  ): EitherAsync<Error, DirectoryContent>;
  createFolder(userId: number, filePath: string): void;
  copy(userId: number, source: string, destination: string): void;
  delete(userId: number, fileToDelete: string): void;
  getBasePath(userId: number): string;
  getFileAsStream(
    userId: number,
    filePath: string,
  ): { file: fs.ReadStream; fileName: string };
}
