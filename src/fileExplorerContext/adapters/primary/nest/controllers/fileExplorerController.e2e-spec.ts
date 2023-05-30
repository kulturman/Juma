import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../../app.module';
import * as request from 'supertest';
import { getToken } from '../../../../../../test/helpers';
import * as fs from 'fs';

describe('FileExplorer controller', () => {
  let app: INestApplication;

  beforeAll(async () => {
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
    const firstLevelDirectory = 'Nest Js course';
    const videoFile = 'Introduction.mp4';
    const pdfFile = 'Resources.pdf';

    it('Should return directory content', async () => {
      const userId = '2000';
      const token = getToken(userId, 'arnaudbakyono@gmail.com');
      const baseDirectory = process.env.TORRENTS_STORAGE_PATH + '/' + userId;

      fs.mkdirSync(`${baseDirectory}/${firstLevelDirectory}`, {
        recursive: true,
      });

      fs.closeSync(fs.openSync(`${baseDirectory}/${videoFile}`, 'w'));
      fs.closeSync(
        fs.openSync(`${baseDirectory}/${firstLevelDirectory}/${pdfFile}`, 'w'),
      );
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
      const userId = '2001';
      const token = getToken(userId, 'arnaudbakyono@gmail.com');
      const baseDirectory = process.env.TORRENTS_STORAGE_PATH + '/' + userId;

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
      const userId = '2002';
      const token = getToken(userId, 'arnaudbakyono@gmail.com');
      const baseDirectory = process.env.TORRENTS_STORAGE_PATH + '/' + userId;

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
    it('Should delete file', async () => {
      const fileToDelete = 'test.txt';
      const userId = '2003';
      const token = getToken(userId, 'arnaudbakyono@gmail.com');
      const baseDirectory = process.env.TORRENTS_STORAGE_PATH + '/' + userId;

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

    it('Should download file', async () => {
      const userId = '2010';
      const baseDirectory = process.env.TORRENTS_STORAGE_PATH + '/' + userId;
      const token = getToken(userId, 'arnaudbakyono@gmail.com');
      const fileContent = 'kulturman is a beast';

      fs.mkdirSync(`${baseDirectory}`, {
        recursive: true,
      });

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
