import { FileStorageGateway } from '../../../../hexagon/gateways/fileStorageGateway';
import * as fs from 'fs';
import * as dirTree from 'directory-tree';
import { LogicException } from '../../../../../shared/hexagon/exceptions/logicException';
import {
  DirectoryContent,
  DirectoryItemType,
} from '../../../../hexagon/useCases/folderContentRetrieval/directoryContent';
import * as path from 'path';
export class FileSystemStorageGateway implements FileStorageGateway {
  copy(source: string, destination: string): void {
    const fileName = path.basename(source);
    fs.cpSync(source, `${destination}/${fileName}`);
  }
  fileExists(path: string): Promise<boolean> {
    return new Promise((resolve) => {
      return resolve(fs.existsSync(path));
    });
  }

  getDirectoryContent(path: string): Promise<DirectoryContent> {
    const directoryContentAsJson = dirTree(path, {
      attributes: ['extension', 'size', 'type'],
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

  createFolder(directoryPath: string): void {
    fs.mkdir(directoryPath, (err) => {
      if (err) {
        throw new LogicException('Unable to create directory');
      }
    });
  }
}
