import { DirectoryContent } from 'src/fileExplorerContext/hexagon/useCases/folderContentRetrieval/DirectoryContent';

export interface FileStorageGateway {
  fileExists(path: string): Promise<boolean>;
  getDirectoryContent(path: string): Promise<DirectoryContent>;
}
