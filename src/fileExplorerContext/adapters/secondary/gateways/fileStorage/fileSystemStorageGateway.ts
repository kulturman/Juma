import {
  DirectoryContent,
  DirectoryItemType,
} from 'src/fileExplorerContext/hexagon/useCases/folderContentRetrieval/DirectoryContent';
import { FileStorageGateway } from '../../../../hexagon/useCases/folderContentRetrieval/gateways/fileStorageGateway';
import * as fs from 'fs';
import * as dirTree from 'directory-tree';

export class FileSystemStorageGateway implements FileStorageGateway {
  fileExists(path: string): Promise<boolean> {
    return new Promise((resolve) => {
      return resolve(fs.existsSync(path));
    });
  }

  getDirectoryContent(path: string): Promise<DirectoryContent> {
    const directoryContentAsJson = dirTree(path, {
      attributes: ['extension', 'size', 'type'],
    });

    directoryContentAsJson.children.forEach((file) => {
      file;
    });

    return Promise.resolve({
      children: directoryContentAsJson.children.map((item) => {
        return {
          type:
            item.type === 'directory'
              ? DirectoryItemType.FOLDER
              : DirectoryItemType.FILE,
          name: item.name,
          size: item.size,
          path: item.path,
          extension: item.extension,
        };
      }),
    });
  }
}
