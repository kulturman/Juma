import { FileStorageGateway } from '../../../../hexagon/gateways/fileStorageGateway';
import * as fs from 'fs';
import * as dirTree from 'directory-tree';
import { LogicException } from '../../../../../shared-kernel/hexagon/exceptions/logicException';
import {
  DirectoryContent,
  DirectoryContentDetails,
  DirectoryItemType,
} from '../../../../hexagon/useCases/folderContentRetrieval/directoryContent';
import * as path from 'path';
import { NotFoundException } from '../../../../../shared-kernel/hexagon/exceptions/notFoundException';
import { EitherAsync, Left, Right } from 'purify-ts';
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
  doesFileExist(userId: number, path: string): Promise<boolean> {
    return new Promise((resolve) => {
      return resolve(fs.existsSync(this.getBasePath(userId) + '/' + path));
    });
  }

  doesBaseDirectoryExist(userId: number): Promise<boolean> {
    return new Promise((resolve) => {
      return resolve(fs.existsSync(this.getBasePath(userId)));
    });
  }

  getDirectoryContent(
    userId: number,
    path: string,
  ): EitherAsync<Error, DirectoryContent> {
    const directoryContentAsJson = dirTree(
      this.getBasePath(userId) + '/' + path,
      {
        attributes: ['extension', 'size', 'type'],
      },
    );
    const children = directoryContentAsJson.children;
    if (!children) return EitherAsync.liftEither(Left(new Error('....')));
    return EitherAsync.liftEither(
      Right({
        children: children.map((item) => {
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
      }),
    );
  }

  createFolder(userId: number, directoryPath: string): void {
    fs.mkdir(this.getBasePath(userId) + '/' + directoryPath, (err) => {
      if (err) {
        throw new LogicException('Unable to create directory');
      }
    });
  }
}
