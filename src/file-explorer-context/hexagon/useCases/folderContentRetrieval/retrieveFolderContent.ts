import {
  DirectoryContent,
  DirectoryContentDetails,
  DirectoryItemType,
} from './DirectoryContent';
import { audiosFormats, videosFormats } from './mediaTypes';
import { FileStorageGateway } from '../../gateways/fileStorageGateway';
import { EitherAsync, Left, Right } from 'purify-ts';

export class RetrieveFolderContent {
  constructor(private readonly fileStorageGateway: FileStorageGateway) {}

  handle(
    userId: number,
    directory: string,
  ): EitherAsync<Error, DirectoryContentDetails> {
    const basePath = this.fileStorageGateway.getBasePath(userId);

    const whenDirectoryExists = (
      directoryContent: DirectoryContent,
    ): EitherAsync<Error, DirectoryContentDetails> => {
      return EitherAsync(async ({ liftEither }) => {
        if (!(await this.fileStorageGateway.doesFileExist(userId, directory)))
          return liftEither(Left(new Error('Directory does not exist')));
        if (directoryContent.children.length === 0) {
          return liftEither(
            Right({
              folders: [],
              files: [],
            }),
          );
        }

        const directoryItems = directoryContent.children.sort((a, b) =>
          a.name.localeCompare(b.name),
        );

        const directoryContentDetails = directoryItems.reduce(
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
        return liftEither(Right(directoryContentDetails));
      });
    };

    return this.fileStorageGateway
      .getDirectoryContent(userId, directory)
      .chain(whenDirectoryExists);
  }
}
