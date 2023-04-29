import { Inject, NotFoundException } from '@nestjs/common';
import { FileStorageGateway } from 'src/fileExplorerContext/hexagon/useCases/folderContentRetrieval/gateways/fileStorageGateway';
import { DirectoryContentDetails, DirectoryItemType } from './DirectoryContent';
import { videosFormats, audiosFormats } from './mediaTypes';

export class RetrieFolderContent {
  constructor(
    @Inject('FileStorageGateway')
    private readonly fileStorageGateway: FileStorageGateway,
  ) {}

  async handle(
    basePath: string,
    directory: string,
  ): Promise<DirectoryContentDetails> {
    const directoryPath = `${basePath}/${directory}`;

    if (!(await this.fileStorageGateway.fileExists(basePath))) {
      return { folders: [], files: [] };
    }

    if (!(await this.fileStorageGateway.fileExists(directoryPath))) {
      throw new NotFoundException('Directory does not exist');
    }

    const directoryContent = await this.fileStorageGateway.getDirectoryContent(
      directoryPath,
    );

    return directoryContent.children.reduce(
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
