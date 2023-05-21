import { FileStorageGatewayStub } from '../../../adapters/secondary/gateways/fileStorage/stubs/fileStorageGatewayStub';
import { DeleteFile } from './deleteFile';
import { use } from 'passport';

describe('Delete file or folder', () => {
  let fileStorageGateway: FileStorageGatewayStub;
  let deleteFileCommandHandler;
  let basePath;
  const userId = 2000;

  beforeEach(() => {
    fileStorageGateway = new FileStorageGatewayStub();
    deleteFileCommandHandler = new DeleteFile(fileStorageGateway);
    basePath = fileStorageGateway.getBasePath(userId);
  });

  it('Should delete file', async () => {
    const fileToDelete = 'toDelete.txt';

    fileStorageGateway.existingDirectoryItems = [basePath + '/toDelete.txt'];

    expect(
      await fileStorageGateway.fileExists(userId, fileToDelete),
    ).toBeTruthy();

    await deleteFileCommandHandler.handle({
      userId: userId,
      filePath: fileToDelete,
    });

    expect(
      await fileStorageGateway.fileExists(userId, fileToDelete),
    ).toBeFalsy();
  });

  /*it('Should throw Exception if file does not exists', async () => {
    const fileToDelete = 'toDelete.txt';
    fileStorageGateway.createBasePath(userId);

    await expect(() =>
      deleteFileCommandHandler.handle({
        userId: userId,
        filePath: fileToDelete,
      }),
    ).rejects.toThrow('File does not exist');
  });*/
});
