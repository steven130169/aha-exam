import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';
import { AuthCredentialDto } from '../src/auth/dto/auth-credential.dto';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  const authService = {
    createUser: jest.fn().mockImplementationOnce(() => Promise.resolve()),
  };
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AuthService)
      .useValue(authService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/signup', () => {
    const user: AuthCredentialDto = {
      email: 'sample@example.com',
      password: 'Password%',
      retypePassword: 'Password%',
    };
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send(user)
      .expect(201);
  });

  it('/auth/signup throw 412 ERROR if password and retypePassword not same.', () => {
    const user: AuthCredentialDto = {
      email: 'sample@example.com',
      password: 'Password%',
      retypePassword: 'Password5',
    };
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send(user)
      .expect(412)
      .then((response) =>
        expect(response.body.message).toEqual(
          'Your retypePassword is not correct.',
        ),
      );
  });
});
