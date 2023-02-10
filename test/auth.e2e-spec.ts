import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';
import { AuthCredentialDto } from '../src/auth/dto/auth-credential.dto';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  const authService = {
    findAll: () => {
      return 'test';
    },
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
});
