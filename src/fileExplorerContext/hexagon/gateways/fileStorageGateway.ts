import { DirectoryContent } from 'src/fileExplorerContext/hexagon/useCases/folderContentRetrieval/directoryContent';
import fs from 'fs';

export interface FileStorageGateway {
  fileExists(userId: number, path: string): Promise<boolean>;
  getDirectoryContent(userId: number, path: string): Promise<DirectoryContent>;
  createFolder(userId: number, filePath: string): void;
  copy(userId: number, source: string, destination: string): void;
  delete(userId: number, fileToDelete: string): void;
  getBasePath(userId: number): string;
  getFileAsStream(
    userId: number,
    filePath: string,
  ): { file: fs.ReadStream; fileName: string };
}
