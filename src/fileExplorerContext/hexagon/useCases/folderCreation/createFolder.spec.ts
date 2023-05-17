import { FileStorageGatewayStub } from '../../../adapters/secondary/gateways/fileStorage/stubs/fileStorageGatewayStub';
import { CreateFolder } from './createFolder';

describe('Folder creation', () => {
  let fileStorageService = null;
  const folderToCreate = 'newDirectory';
  const basePath = '/home/kulturman/1';

  beforeEach(() => {
    fileStorageService = new FileStorageGatewayStub();
  });

  it('Should throw NotFoundException is baseDirectory does not exist', async () => {
    await expect(
      new CreateFolder(fileStorageService).handle({
        basePath,
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
        basePath,
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
      basePath,
      path: 'innerDir',
      folderName: folderToCreate,
    });

    expect(
      await fileStorageService.fileExists(
        basePath + '/innerDir/' + folderToCreate,
      ),
    ).toBe(true);
  });
});
