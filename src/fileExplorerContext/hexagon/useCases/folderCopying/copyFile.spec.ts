import { CopyFile } from './copyFile';
import { FileStorageGatewayStub } from '../../../adapters/secondary/gateways/fileStorage/stubs/fileStorageGatewayStub';
import { BadRequestException } from '../../../../shared/hexagon/exceptions/badRequestException';

describe('Copy file', () => {
  let fileStorageGateway;

  beforeEach(() => {
    fileStorageGateway = new FileStorageGatewayStub();
  });

  it('Should copy file', async () => {
    fileStorageGateway.existingDirectoryItems = ['/test/innerDoc/test2.txt'];

    const copyFileCommand = {
      source: '/test/innerDoc/test2.txt',
      destination: '/test/test2.txt',
    };

    await new CopyFile(fileStorageGateway).handle(copyFileCommand);
    expect(
      await fileStorageGateway.fileExists(copyFileCommand.destination),
    ).toBe(true);
  });

  it('Should throw a NotFoundException if source does not exist', async () => {
    const copyFileCommand = {
      source: '/test/innerDoc/test2.txt',
      destination: '/test/test2.txt',
    };
    await expect(async () =>
      new CopyFile(fileStorageGateway).handle(copyFileCommand),
    ).rejects.toThrow(BadRequestException);
  });

  it('Should throw a NotFoundException if destination file already exists', async () => {
    fileStorageGateway.existingDirectoryItems = [
      '/test/innerDoc/test2.txt',
      '/test/test2.txt',
    ];
    const copyFileCommand = {
      source: '/test/innerDoc/test2.txt',
      destination: '/test/test2.txt',
    };
    await expect(async () =>
      new CopyFile(fileStorageGateway).handle(copyFileCommand),
    ).rejects.toThrow(BadRequestException);
  });
});
