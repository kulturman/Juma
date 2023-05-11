import { RetrieveFolderContent } from './retrieveFolderContent';
import {
  DirectoryContent,
  DirectoryContentDetails,
  DirectoryEntity,
  DirectoryItemType,
} from './directoryContent';
import * as path from 'path';
import * as _ from 'lodash';
import { NotFoundException } from '../../../../shared/hexagon/exceptions/notFoundException';
import { FileStorageGatewayStub } from './FileStorageGatewayStub';

describe('Folder content retrieval', () => {
  const basePath = '/home/kulturman/1';
  const directoryPath = 'directoryPath';
  let fileStorageGateway: FileStorageGatewayStub;

  beforeEach(() => {
    fileStorageGateway = new FileStorageGatewayStub();
  });

  it('Should retrieve nothing if base directory does not exist', async () => {
    expectDirectoryContentDetails(
      await retrieveDirectoryContent(basePath, directoryPath),
      {
        folders: [],
        files: [],
      },
    );
  });

  it('It should raise an exception if directory path does not exist', async () => {
    initExistingDirectories(basePath);
    await expect(async () =>
      retrieveDirectoryContent(basePath, directoryPath),
    ).rejects.toThrow('Directory does not exist');
  });

  describe('Retrieve files and folders in the directory', () => {
    beforeEach(() => {
      const file = createFile('my-poetry.txt', 300);
      const anotherFile = createFile('another-poetry.txt', 30);
      initDirectoryContent(file, anotherFile);
      initExistingDirectories(basePath, basePath + '/' + directoryPath);
    });

    it('Should retrieve two files (non audio or video) and one video and one audio and two folders', async () => {
      const audioFile = createFile('music.mp3', 200);
      const videoFIle = createFile('video.mp4', 200);
      const folder = createFolder('folder', 100);
      const anotherFolder = createFolder('anotherFolder', 200);

      fileStorageGateway.addItems(audioFile, videoFIle, folder, anotherFolder);

      expectDirectoryContentDetails(
        await retrieveDirectoryContent(basePath, directoryPath),
        {
          folders: [
            { ..._.omit(anotherFolder, ['type']) },
            { ..._.omit(folder, ['type']) },
          ],
          files: [
            {
              name: 'another-poetry.txt',
              path: directoryPath + '/another-poetry.txt',
              size: 30,
              isVideo: false,
              isAudio: false,
            },
            {
              name: 'music.mp3',
              size: 200,
              path: 'directoryPath/music.mp3',
              isVideo: false,
              isAudio: true,
            },
            {
              name: 'my-poetry.txt',
              path: directoryPath + '/my-poetry.txt',
              size: 300,
              isVideo: false,
              isAudio: false,
            },
            {
              name: 'video.mp4',
              size: 200,
              path: 'directoryPath/video.mp4',
              isVideo: true,
              isAudio: false,
            },
          ],
        },
      );
    });
  });

  const createFile = (fileName: string, size: number): DirectoryEntity => {
    return {
      type: DirectoryItemType.FILE,
      size,
      name: fileName,
      extension: path.extname(fileName),
      path: directoryPath + '/' + fileName,
    };
  };

  const createFolder = (folderName: string, size: number): DirectoryEntity => {
    return {
      type: DirectoryItemType.FOLDER,
      size,
      name: folderName,
      path: directoryPath + '/' + folderName,
    };
  };

  const retrieveDirectoryContent = (
    basePath: string,
    directoryPath: string,
  ) => {
    return new RetrieveFolderContent(fileStorageGateway).handle(
      basePath,
      directoryPath,
    );
  };

  const initDirectoryContent = (
    ...directoryContentChildren: DirectoryContent['children']
  ) => {
    return (fileStorageGateway.directoryContent = {
      children: directoryContentChildren,
    });
  };

  const initExistingDirectories = (...items: string[]) => {
    fileStorageGateway.existingDirectoryItems = items;
  };

  const expectDirectoryContentDetails = (
    actualDirectoryContentDetails: DirectoryContentDetails,
    expectedDirectoryContentDetails: DirectoryContentDetails,
  ) =>
    expect(actualDirectoryContentDetails).toEqual<DirectoryContentDetails>(
      expectedDirectoryContentDetails,
    );
});
