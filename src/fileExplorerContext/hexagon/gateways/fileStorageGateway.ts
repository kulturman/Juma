import { DirectoryContent } from 'src/fileExplorerContext/hexagon/useCases/folderContentRetrieval/directoryContent';
import fs from 'fs';

export interface FileStorageGateway {
  fileExists(path: string): Promise<boolean>;
  getDirectoryContent(path: string): Promise<DirectoryContent>;
  createFolder(filePath: string): void;
  copy(source: string, destination: string): void;
  delete(userId: number, fileToDelete: string): void;
  getBasePath(userId: number): string;
  getFileAsStream(
    userId: number,
    filePath: string,
  ): { file: fs.ReadStream; fileName: string };
}
