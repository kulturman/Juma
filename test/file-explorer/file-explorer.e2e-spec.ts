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

  /*describe('DELETE /fs/', () => {
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

  describe('POST /fs/rename/:filePath', () => {
    const token = getToken('2000', 'arnaudbakyono@gmail.com');
    const baseDirectory = process.env.TORRENTS_STORAGE_PATH + '/2000';
    const directoryToRename = 'innerDirectory/Mybad';
    const directoryNewName = 'NestJS';

    it('Should rename the item (directory or file)', async () => {
      fs.mkdirSync(`${baseDirectory}/${directoryToRename}`, {
        recursive: true,
      });

      expect(
        fs.existsSync(baseDirectory + '/' + directoryToRename),
      ).toBeTruthy();

      await request(app.getHttpServer())
        .post(`/fs/rename/${encodeURIComponent(directoryToRename)}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ newName: directoryNewName })
        .expect(200);

      expect(
        fs.existsSync(baseDirectory + '/' + directoryToRename),
      ).toBeFalsy();

      expect(
        fs.existsSync(baseDirectory + '/innerDirectory/' + directoryNewName),
      ).toBeTruthy();

      fs.rmSync(baseDirectory, { recursive: true, force: true });
    });
  });

  describe('POST /fs/copy/:filePath', () => {
    const token = getToken('2000', 'arnaudbakyono@gmail.com');
    const baseDirectory = process.env.TORRENTS_STORAGE_PATH + '/2000';
    const fileToCopy = 'test.txt';

    it('Should copy the file', async () => {
      fs.mkdirSync(`${baseDirectory}/d1`, {
        recursive: true,
      });

      fs.closeSync(fs.openSync(`${baseDirectory}/${fileToCopy}`, 'w'));

      expect(fs.existsSync(`${baseDirectory}/${fileToCopy}`)).toBeTruthy();

      expect(!fs.existsSync(baseDirectory + '/d1/' + fileToCopy)).toBeTruthy();

      await request(app.getHttpServer())
        .post(`/fs/copy/${encodeURIComponent(fileToCopy)}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ destination: 'd1' })
        .expect(200);

      expect(fs.existsSync(`${baseDirectory}/${fileToCopy}`)).toBeTruthy();

      expect(fs.existsSync(baseDirectory + '/d1/' + fileToCopy)).toBeTruthy();

      fs.rmSync(baseDirectory, { recursive: true, force: true });
    });
  });*/
});
