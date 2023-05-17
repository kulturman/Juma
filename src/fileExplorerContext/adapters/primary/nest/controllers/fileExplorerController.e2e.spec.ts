import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../../app.module';
import * as request from 'supertest';
import { getToken } from '../../../../../../test/helpers';
import * as fs from 'fs';

describe('FileExplorer controller', () => {
  let app: INestApplication;
  let token: string;
  const userId = '2000';
  const baseDirectory = process.env.TORRENTS_STORAGE_PATH + '/' + userId;

  beforeAll(async () => {
    token = getToken(userId, 'arnaudbakyono@gmail.com');
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /fs/folder', () => {
    const token = getToken(userId, 'arnaudbakyono@gmail.com');
    const firstLevelDirectory = 'Nest Js course';
    const videoFile = 'Introduction.mp4';
    const pdfFile = 'Resources.pdf';
    const createDirectories = () => {
      fs.mkdirSync(`${baseDirectory}/${firstLevelDirectory}`, {
        recursive: true,
      });

      fs.closeSync(fs.openSync(`${baseDirectory}/${videoFile}`, 'w'));
      fs.closeSync(
        fs.openSync(`${baseDirectory}/${firstLevelDirectory}/${pdfFile}`, 'w'),
      );
    };

    it('Should return directory content', async () => {
      createDirectories();
      const { body } = await request(app.getHttpServer())
        .get('/fs/folder')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      fs.rmSync(baseDirectory, { recursive: true, force: true });

      expect(body).toMatchObject({
        files: [
          {
            name: videoFile,
            path: videoFile,
            size: 0,
            isVideo: true,
            isAudio: false,
          },
        ],
        folders: [
          {
            name: firstLevelDirectory,
            path: firstLevelDirectory,
            size: 0,
          },
        ],
      });
    });
  });

  describe('POST /fs/folder', () => {
    const createdDirectory = 'Mybad';

    it('Should create new directory', async () => {
      fs.mkdirSync(`${baseDirectory}`, { recursive: true });
      await request(app.getHttpServer())
        .post('/fs/folder')
        .set('Authorization', `Bearer ${token}`)
        .send({ folderName: createdDirectory })
        .expect(201);

      expect(
        fs.existsSync(baseDirectory + '/' + createdDirectory),
      ).toBeTruthy();
      fs.rmSync(baseDirectory, { recursive: true, force: true });
    });
  });

  describe('POST /fs/copy', () => {
    const firstLevelDirectory = 'innerDirectory';
    const fileToCopy = 'test.txt';

    it('Should copy file', async () => {
      fs.mkdirSync(`${baseDirectory}/${firstLevelDirectory}`, {
        recursive: true,
      });

      fs.closeSync(fs.openSync(`${baseDirectory}/${fileToCopy}`, 'w'));
      expect(
        fs.existsSync(`${baseDirectory}/${firstLevelDirectory}/${fileToCopy}`),
      ).toBeFalsy();

      await request(app.getHttpServer())
        .post(`/fs/copy/${fileToCopy}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ destination: firstLevelDirectory })
        .expect(200);

      expect(
        fs.existsSync(`${baseDirectory}/${firstLevelDirectory}/${fileToCopy}`),
      ).toBeTruthy();
      fs.rmSync(baseDirectory, { recursive: true, force: true });
    });
  });

  describe('DELETE /fs', () => {
    const fileToDelete = 'test.txt';

    it('Should delete file', async () => {
      fs.mkdirSync(`${baseDirectory}`, {
        recursive: true,
      });

      fs.closeSync(fs.openSync(`${baseDirectory}/${fileToDelete}`, 'w'));
      expect(fs.existsSync(`${baseDirectory}/${fileToDelete}`)).toBeTruthy();

      await request(app.getHttpServer())
        .delete(`/fs/${fileToDelete}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(fs.existsSync(`${baseDirectory}/${fileToDelete}`)).toBeFalsy();
      fs.rmSync(baseDirectory, { recursive: true, force: true });
    });
  });

  describe('GET /fs/file/download', () => {
    const fileToDownload = '9780321127426.txt';
    const downloadedFileName = `download.${fileToDownload}`;

    fs.mkdirSync(`${baseDirectory}`, {
      recursive: true,
    });

    it('Should download file', async () => {
      const fileContent = 'kulturman is a beast';
      await fs.promises.writeFile(
        `${baseDirectory}/${fileToDownload}`,
        fileContent,
      );
      const response = await request(app.getHttpServer())
        .get(`/fs/file/download/${fileToDownload}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      expect(response.headers['content-type']).toEqual(
        'application/octet-stream',
      );
      expect(response.headers['content-disposition']).toContain(
        `attachment; filename="${fileToDownload}"`,
      );
      //Let's write file in the same directory with a different name
      await fs.promises.writeFile(
        `${baseDirectory}/${downloadedFileName}`,
        response.body,
      );

      expect(
        fs.readFileSync(`${baseDirectory}/${downloadedFileName}`, 'utf-8'),
      ).toEqual(fileContent);

      fs.rmSync(baseDirectory, { recursive: true, force: true });
    });
  });
});
