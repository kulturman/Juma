import { CopyFile } from './copyFile';
import { FileStorageGatewayStub } from '../../../adapters/secondary/gateways/fileStorage/stubs/fileStorageGatewayStub';
import { BadRequestException } from '../../../../shared/hexagon/exceptions/badRequestException';
import * as path from 'path';

describe('Copy file', () => {
  let fileStorageGateway;
  let basePath: string;
  const userId = 2000;

  beforeEach(() => {
    fileStorageGateway = new FileStorageGatewayStub();
    basePath = fileStorageGateway.getBasePath(userId);
  });

  it('Should copy file', async () => {
    fileStorageGateway.existingDirectoryItems = [
      `${basePath}/innerDoc/test2.txt`,
    ];

    const copyFileCommand = {
      source: `innerDoc/test2.txt`,
      destination: ``,
      userId,
    };

    await new CopyFile(fileStorageGateway).handle(copyFileCommand);
    const fileName = path.basename(copyFileCommand.source);

    expect(await fileStorageGateway.fileExists(userId, fileName)).toBe(true);
  });

  it('Should throw a NotFoundException if source does not exist', async () => {
    const copyFileCommand = {
      source: 'innerDoc/test2.txt',
      destination: '',
      userId,
    };
    await expect(async () =>
      new CopyFile(fileStorageGateway).handle(copyFileCommand),
    ).rejects.toThrow(BadRequestException);
  });

  it('Should throw a NotFoundException if destination file already exists', async () => {
    fileStorageGateway.existingDirectoryItems = [
      `${basePath}/innerDoc/test2.txt`,
      `${basePath}/test2.txt`,
    ];
    const copyFileCommand = {
      source: 'innerDoc/test2.txt',
      destination: '',
      userId,
    };
    await expect(async () =>
      new CopyFile(fileStorageGateway).handle(copyFileCommand),
    ).rejects.toThrow(BadRequestException);
  });
});
