import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import * as fs from 'fs';
import { cleanFixtures, getToken, loadFixtures } from '../helpers';
import { AppModule } from '../../src/app.module';

describe('FileExplorer controller', () => {
  let app: INestApplication;

  beforeEach(async () => {
    await loadFixtures();
  });

  afterEach(async () => {
    await cleanFixtures();
  });

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
    const token = getToken('2000', 'arnaudbakyono@gmail.com');
    const firstLevelDirectory = 'Nest Js course';
    const videoFile = 'Introduction.mp4';
    const pdfFile = 'Resources.pdf';
    const baseDirectory = process.env.TORRENTS_STORAGE_PATH + '/2000';

    const createDirectories = () => {
      fs.mkdirSync(`${baseDirectory}/${firstLevelDirectory}`, {
        recursive: true,
      });

      fs.closeSync(fs.openSync(`${baseDirectory}/${videoFile}`, 'w'));
      fs.closeSync(
        fs.openSync(`${baseDirectory}/${firstLevelDirectory}/${pdfFile}`, 'w'),
      );
    };

    it('Should return empty files if user torrent directory do not exist', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/fs/folder')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(body).toMatchObject({
        folders: [],
        files: [],
      });
    });

    describe('Return directory content when user torrent directory exists', () => {
      const token = getToken('2000', 'arnaudbakyono@gmail.com');

      it('Should return root directory content', async () => {
        createDirectories();
        const { body } = await request(app.getHttpServer())
          .get('/fs/folder')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);

        fs.rmSync(baseDirectory, { recursive: true, force: true });

        expect(body).toMatchObject({
          files: [
            {
              name: 'Introduction.mp4',
              path: 'Introduction.mp4',
              size: 0,
              isVideo: true,
              isAudio: false,
            },
          ],
          folders: [
            {
              name: 'Nest Js course',
              path: 'Nest Js course',
              size: 0,
            },
          ],
        });
      });

      it('Should return inner directory content', async () => {
        createDirectories();
        const { body } = await request(app.getHttpServer())
          .get('/fs/folder/Nest Js course')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);

        fs.rmSync(baseDirectory, { recursive: true, force: true });

        expect(body).toMatchObject({
          files: [
            {
              name: 'Resources.pdf',
              path: 'Nest Js course/Resources.pdf', //The relative path here
              size: 0,
              isVideo: false,
              isAudio: false,
            },
          ],
          folders: [],
        });
      });

      it('Should throw forbidden exception if path contains ..', async () => {
        createDirectories();
        await request(app.getHttpServer())
          .get('/fs/folder/Nest Js course%2F..')
          .set('Authorization', `Bearer ${token}`)
          .expect(403);

        fs.rmSync(baseDirectory, { recursive: true, force: true });
      });
    });
  });

  describe('POST /fs/folder', () => {
    const token = getToken('2000', 'arnaudbakyono@gmail.com');
    const baseDirectory = process.env.TORRENTS_STORAGE_PATH + '/2000';
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

    it('Should fail to create directory if already exists', async () => {
      fs.mkdirSync(`${baseDirectory}/${createdDirectory}`, {
        recursive: true,
      });
      await request(app.getHttpServer())
        .post('/fs/folder')
        .set('Authorization', `Bearer ${token}`)
        .send({ folderName: createdDirectory })
        .expect(400);

      fs.rmSync(baseDirectory, { recursive: true, force: true });
    });
  });

  describe('DELETE /fs/', () => {
    const token = getToken('2000', 'arnaudbakyono@gmail.com');
    const baseDirectory = process.env.TORRENTS_STORAGE_PATH + '/2000';
    const directoryToDelete = 'Mybad';
    const fileToDelete = 'Mybad.txt';

    it('Should delete the directory', async () => {
      fs.mkdirSync(`${baseDirectory}/${directoryToDelete}`, {
        recursive: true,
      });

      expect(
        fs.existsSync(baseDirectory + '/' + directoryToDelete),
      ).toBeTruthy();

      await request(app.getHttpServer())
        .delete(`/fs/${directoryToDelete}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(
        fs.existsSync(baseDirectory + '/' + directoryToDelete),
      ).toBeFalsy();
      fs.rmSync(baseDirectory, { recursive: true, force: true });
    });

    it('Should delete the file', async () => {
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
});
