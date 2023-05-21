import {
  DirectoryContent,
  DirectoryContentDetails,
  DirectoryItemType,
} from './DirectoryContent';
import { audiosFormats, videosFormats } from './mediaTypes';
import { NotFoundException } from '@nestjs/common';
import { FileStorageGateway } from '../../gateways/fileStorageGateway';

export class RetrieveFolderContent {
  constructor(private readonly fileStorageGateway: FileStorageGateway) {}

  async handle(
    userId: number,
    directory: string,
  ): Promise<DirectoryContentDetails> {
    const basePath = this.fileStorageGateway.getBasePath(userId);

    if (!(await this.fileStorageGateway.fileExists(userId, ''))) {
      return { folders: [], files: [] };
    }

    const directoryContent: DirectoryContent =
      await this.fileStorageGateway.getDirectoryContent(userId, directory);

    if (!(await this.fileStorageGateway.fileExists(userId, directory))) {
      throw new NotFoundException('Directory does not exist');
    }

    if (directoryContent.children.length === 0) {
      return {
        folders: [],
        files: [],
      };
    }

    const directoryItems = directoryContent.children.sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    return directoryItems.reduce(
      (acc, folderItem) => {
        const accumulatedFolders = acc.folders;
        const accumulatedFiles = acc.files;
        const baseContentProperties = {
          name: folderItem.name,
          path: folderItem.path.replace(`${basePath}/`, ''),
          size: folderItem.size,
        };

        if (folderItem.type === DirectoryItemType.FOLDER) {
          return {
            ...acc,
            folders: [...accumulatedFolders, baseContentProperties],
          };
        } else {
          return {
            ...acc,
            files: [
              ...accumulatedFiles,
              {
                ...baseContentProperties,
                isVideo: videosFormats.includes(
                  folderItem.extension.toUpperCase(),
                ),
                isAudio: audiosFormats.includes(
                  folderItem.extension.toUpperCase(),
                ),
              },
            ],
          };
        }
      },
      { folders: [], files: [] },
    );
  }
}
