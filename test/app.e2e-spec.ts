import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import exp from 'constants';
import { response } from 'express';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });



  afterAll(async () => {
    await app.close()
  })

  describe('User Module', () => {
    describe('/user/login (POST)', () => {
      it('should login successfully and return tokens', async () => {
        const response = await request(app.getHttpServer())
          .post('/user/login')
          .send({ student_code: 'test_code', name: 'test_name', major: 'test_major', password: 'test_password' })

        expect(response.body._statusCode).toBe(201)
        expect(response.body._data).toHaveProperty('access_token');
        expect(response.body._data).toHaveProperty('refresh_token');

        accessToken = response.body._data.access_token;
      });
    });

    // describe('/user/logout (GET)', () => {
    //   it('should return 204', async () => {
    //     const response = await request(app.getHttpServer())
    //       .get('/user/logout')
    //       .set('Authorization', `Bearer ${accessToken}`)

    //     expect(response.body._statusCode).toBe(204)
    //   });
    // });

    describe('/user/event/list (GET)', () => {
      it('should return the event list and participation history', async () => {
        const response = await request(app.getHttpServer())
          .get('/user/event/list')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body._data.events).toBeInstanceOf(Array);
      });
    });

    describe('/user/attendance (POST)', () => {
      it('should save participation successfully', async () => {
        await request(app.getHttpServer())
          .post('/user/attendance')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ event_code: 'SCHUSWCU1stAF_OpeningCeremony' })
          .expect(201);
      });

      it('should dupulicated code', async () => {
        await request(app.getHttpServer())
          .post('/user/attendance')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ event_code: 'SCHUSWCU1stAF_OpeningCeremony' })
          .expect(452)
      });

      it('should dupulicated code', async () => {
        await request(app.getHttpServer())
          .post('/user/attendance')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ event_code: 'nothing' })
          .expect(451)
      });
    });

    describe('/user/setting/info (GET)', () => {
      it('should return student settings info', async () => {
        const response = await request(app.getHttpServer())
          .get('/user/setting/info')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body._data).toHaveProperty('student_code');
        expect(response.body._data).toHaveProperty('name');
        expect(response.body._data).toHaveProperty('major');
      });
    });

    describe('/user (DELETE)', () => {
      it('should delete the user successfully', async () => {
        await request(app.getHttpServer())
          .delete('/user')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(204);
      });
    });
  });

})

