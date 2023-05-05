import { Inject } from '@nestjs/common';
import { FileStorageGateway } from 'src/fileExplorerContext/hexagon/useCases/folderContentRetrieval/gateways/fileStorageGateway';
import { DirectoryContent, DirectoryContentDetails } from './DirectoryContent';

export class RetrieveFolderContent {
  constructor(
    @Inject('FileStorageGateway')
    private readonly fileStorageGateway: FileStorageGateway,
  ) {}

  async handle(
    basePath: string,
    directory: string,
  ): Promise<DirectoryContentDetails> {
    const directoryPath = `${basePath}/${directory}`;
    const directoryContent: DirectoryContent =
      await this.fileStorageGateway.getDirectoryContent(directoryPath);

    if (directoryContent.children.length === 0)
      return {
        folders: [],
        files: [],
      };

    const files = directoryContent.children.map((file) => ({
      name: file.name,
      path: file.path,
      size: file.size,
    }));

    return {
      folders: [],
      files: files.map((file) => ({
        ...file,
        isVideo: false,
        isAudio: false,
      })),
    };

    /*if (!(await this.fileStorageGateway.fileExists(basePath))) {
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
    );*/
  }
}
