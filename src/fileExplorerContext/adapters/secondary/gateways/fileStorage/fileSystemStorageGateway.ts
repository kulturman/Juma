import { FileStorageGateway } from '../../../../hexagon/gateways/fileStorageGateway';
import * as fs from 'fs';
import * as dirTree from 'directory-tree';
import { LogicException } from '../../../../../sharedKernel/hexagon/exceptions/logicException';
import {
  DirectoryContent,
  DirectoryItemType,
} from '../../../../hexagon/useCases/folderContentRetrieval/directoryContent';
import * as path from 'path';
import { NotFoundException } from '../../../../../sharedKernel/hexagon/exceptions/notFoundException';
export class FileSystemStorageGateway implements FileStorageGateway {
  getFileAsStream(
    userId: number,
    filePath: string,
  ): { file: fs.ReadStream; fileName: string } {
    {
      const fullFilePath = `${this.getBasePath(userId)}/${filePath}`;

      if (!fs.existsSync(fullFilePath)) {
        throw new NotFoundException('File not found');
      }

      return {
        file: fs.createReadStream(fullFilePath),
        fileName: path.basename(filePath),
      };
    }
  }

  getBasePath(userId: number): string {
    return `${process.env.TORRENTS_STORAGE_PATH}/${userId}`;
  }
  delete(userId: number, fileToDelete: string): void {
    fs.rmSync(this.getBasePath(userId) + '/' + fileToDelete, {
      recursive: true,
      force: true,
    });
  }
  copy(userId: number, source: string, destination: string): void {
    const fileName = path.basename(source);
    fs.cpSync(
      `${this.getBasePath(userId)}/${source}`,
      `${this.getBasePath(userId)}/${destination}/${fileName}`,
    );
  }
  fileExists(userId: number, path: string): Promise<boolean> {
    return new Promise((resolve) => {
      return resolve(fs.existsSync(this.getBasePath(userId) + '/' + path));
    });
  }

  getDirectoryContent(userId: number, path: string): Promise<DirectoryContent> {
    const directoryContentAsJson = dirTree(
      this.getBasePath(userId) + '/' + path,
      {
        attributes: ['extension', 'size', 'type'],
      },
    );
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

  createFolder(userId: number, directoryPath: string): void {
    fs.mkdir(this.getBasePath(userId) + '/' + directoryPath, (err) => {
      if (err) {
        throw new LogicException('Unable to create directory');
      }
    });
  }
}
