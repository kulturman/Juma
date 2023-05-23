import { FileStorageGatewayStub } from '../../../adapters/secondary/gateways/fileStorage/stubs/fileStorageGatewayStub';
import { CreateFolder } from './createFolder';

describe('Folder creation', () => {
  let fileStorageService = null;
  const userId = 100;
  const folderToCreate = 'newDirectory';
  let basePath;

  beforeEach(() => {
    fileStorageService = new FileStorageGatewayStub();
    basePath = fileStorageService.getBasePath(userId);
  });

  it('Should throw NotFoundException is baseDirectory does not exist', async () => {
    await expect(
      new CreateFolder(fileStorageService).handle({
        userId,
        path: '',
        folderName: folderToCreate,
      }),
    ).rejects.toThrow('Path not found');
  });

  it('Should throw BadRequestException is directory to create already exists', async () => {
    fileStorageService.existingDirectoryItems = [
      basePath,
      basePath + '/' + folderToCreate,
    ];
    await expect(() =>
      new CreateFolder(fileStorageService).handle({
        userId,
        path: '',
        folderName: folderToCreate,
      }),
    ).rejects.toThrow('Directory already exists');
  });

  it('Should create directory', async () => {
    fileStorageService.existingDirectoryItems = [
      basePath,
      basePath + '/innerDir',
    ];

    await new CreateFolder(fileStorageService).handle({
      userId,
      path: 'innerDir',
      folderName: folderToCreate,
    });

    expect(
      await fileStorageService.fileExists(userId, 'innerDir/' + folderToCreate),
    ).toBe(true);
  });
});
