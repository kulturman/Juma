import { DirectoryContent } from 'src/fileExplorerContext/hexagon/useCases/folderContentRetrieval/directoryContent';

export interface FileStorageGateway {
  fileExists(path: string): Promise<boolean>;
  getDirectoryContent(path: string): Promise<DirectoryContent>;
  createFolder(filePath: string): void;
  copy(source: string, destination: string): void;
}
