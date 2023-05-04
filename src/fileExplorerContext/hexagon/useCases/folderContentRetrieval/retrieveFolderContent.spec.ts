import { RetrieveFolderContent } from './retrieveFolderContent';
import {
  DirectoryContent,
  DirectoryContentDetails,
  DirectoryItemType,
} from './directoryContent';
import { FileStorageGateway } from './gateways/fileStorageGateway';

describe('Folder content retrieval', () => {
  const basePath = 'basePath';
  const directoryPath = 'directoryPath';
  const absolutePath = basePath + '/' + directoryPath;
  let fileStorageGateway: FileStorageGatewayStub;

  beforeEach(() => {
    fileStorageGateway = new FileStorageGatewayStub();
  });

  it(' should retrieve nothing if the directory content is empty', async () => {
    expectDirectoryContentDetails(
      await retrieveDirectoryContent(basePath, directoryPath),
      {
        folders: [],
        files: [],
      },
    );
  });

  describe('Single file in the directory', () => {
    beforeEach(() => {
      initDirectoryContent(aFile);
    });

    it(' should retrieve that single file', async () => {
      expectDirectoryContentDetails(
        await retrieveDirectoryContent(basePath, directoryPath),
        {
          folders: [],
          files: [
            {
              name: 'my-poetry.txt',
              path: absolutePath + '/my-poetry.txt',
              size: 3,
              isVideo: false,
              isAudio: false,
            },
          ],
        },
      );
    });
  });

  describe('Two files in the directory', () => {
    beforeEach(() => {
      const anotherFile = {
        ...aFile,
        name: 'another-poetry.txt',
        path: absolutePath + '/another-poetry.txt',
      };
      initDirectoryContent(aFile, anotherFile);
    });

    it(' should retrieve both files', async () => {
      expectDirectoryContentDetails(
        await retrieveDirectoryContent(basePath, directoryPath),
        {
          folders: [],
          files: [
            {
              name: 'my-poetry.txt',
              path: absolutePath + '/my-poetry.txt',
              size: 3,
              isVideo: false,
              isAudio: false,
            },
            {
              name: 'another-poetry.txt',
              path: absolutePath + '/another-poetry.txt',
              size: 3,
              isVideo: false,
              isAudio: false,
            },
          ],
        },
      );
    });
  });

  const retrieveDirectoryContent = (basePath: string, directoryPath: string) =>
    new RetrieveFolderContent(fileStorageGateway).handle(
      basePath,
      directoryPath,
    );

  const initDirectoryContent = (
    ...directoryContentChildren: DirectoryContent['children']
  ) =>
    (fileStorageGateway.directoryContent = {
      children: directoryContentChildren,
    });

  const expectDirectoryContentDetails = (
    actualDirectoryContentDetails: DirectoryContentDetails,
    expectedDirectoryContentDetails: DirectoryContentDetails,
  ) =>
    expect(actualDirectoryContentDetails).toEqual<DirectoryContentDetails>(
      expectedDirectoryContentDetails,
    );

  const aFile = {
    name: 'my-poetry.txt',
    path: absolutePath + '/my-poetry.txt',
    size: 3,
    type: DirectoryItemType.FILE,
    extension: '.txt',
  };
});

class FileStorageGatewayStub implements FileStorageGateway {
  private _directoryContent: DirectoryContent = { children: [] };

  async getDirectoryContent(path: string): Promise<DirectoryContent> {
    return this._directoryContent;
  }

  async fileExists(path: string): Promise<boolean> {
    return false;
  }

  set directoryContent(value: DirectoryContent) {
    this._directoryContent = value;
  }
}
