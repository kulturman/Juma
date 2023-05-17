import { FileStorageGatewayStub } from '../../../adapters/secondary/gateways/fileStorage/stubs/fileStorageGatewayStub';
import { DeleteFile } from './deleteFile';

describe('Delete file or folder', () => {
  let fileStorageGateway;
  let deleteFileCommandHandler;
  const userId = 2000;

  beforeEach(() => {
    fileStorageGateway = new FileStorageGatewayStub();
    deleteFileCommandHandler = new DeleteFile(fileStorageGateway);
  });

  it('Should delete file', async () => {
    const fileToDelete = 'toDelete.txt';
    const basePath = fileStorageGateway.getBasePath(userId);

    fileStorageGateway.existingDirectoryItems = [basePath + '/toDelete.txt'];

    expect(
      await fileStorageGateway.fileExists(basePath + '/toDelete.txt'),
    ).toBeTruthy();

    await deleteFileCommandHandler.handle({
      userId: userId,
      filePath: fileToDelete,
    });

    expect(
      await fileStorageGateway.fileExists(basePath + '/toDelete.txt'),
    ).toBeFalsy();
  });

  it('Should throw Exception if file does not exists', async () => {
    const fileToDelete = 'toDelete.txt';
    fileStorageGateway.createBasePath(userId);

    await expect(() =>
      deleteFileCommandHandler.handle({
        userId: userId,
        filePath: fileToDelete,
      }),
    ).rejects.toThrow('File does not exist');
  });
});
