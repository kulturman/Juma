import { INestApplication, ValidationPipe } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import * as request from 'supertest';
import { cleanFixtures, getToken, loadFixtures } from "../helpers";
import { AppModule } from "../../src/app.module";

describe('FileExplorer controller', () => {
    let app: INestApplication;

    beforeEach(async () => {
        await loadFixtures();
    })
    
    afterEach(async () => {
        await cleanFixtures();
    })

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = module.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    })

    describe('GET /fs/folder', () => {
        const token = getToken('1000', 'arnaudbakyono@gmail.com');

        it('Should return empty files and', async () => {
            const { body } = await request(app.getHttpServer())
                .get('/fs/folder')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(body).toMatchObject({
                folders: [],
                files: []
            })
        })
    })
})
