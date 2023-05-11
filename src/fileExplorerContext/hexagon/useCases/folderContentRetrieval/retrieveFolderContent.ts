import { FileStorageGateway } from 'src/fileExplorerContext/hexagon/useCases/folderContentRetrieval/gateways/fileStorageGateway';
import {
  DirectoryContent,
  DirectoryContentDetails,
  DirectoryItemType,
} from './DirectoryContent';
import { audiosFormats, videosFormats } from './mediaTypes';
import { NotFoundException } from '@nestjs/common';

export class RetrieveFolderContent {
  constructor(private readonly fileStorageGateway: FileStorageGateway) {}

  async handle(
    basePath: string,
    directory: string,
  ): Promise<DirectoryContentDetails> {
    const directoryPath = `${basePath}/${directory}`;

    if (!(await this.fileStorageGateway.fileExists(basePath))) {
      return { folders: [], files: [] };
    }

    const directoryContent: DirectoryContent =
      await this.fileStorageGateway.getDirectoryContent(directoryPath);
    if (!(await this.fileStorageGateway.fileExists(directoryPath))) {
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
