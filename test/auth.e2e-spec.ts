import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthCredentialDto } from '../src/auth/dto/auth-credential.dto';
import { Repository } from 'typeorm';
import { UserEntity } from '../src/auth/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<UserEntity>;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    userRepository = moduleFixture.get(getRepositoryToken(UserEntity));
    await userRepository.delete({});
  });

  it('/auth/signup', async () => {
    const user: AuthCredentialDto = {
      email: 'sample@example.com',
      password: 'Password5%',
      retypePassword: 'Password5%',
    };
    const signupResponse = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(user);
    expect(signupResponse.statusCode).toEqual(201);
  });

  it('/auth/signup throw 412 ERROR if password and retypePassword not same.', async () => {
    const user: AuthCredentialDto = {
      email: 'sample@example.com',
      password: 'Password5%',
      retypePassword: 'Password5%^',
    };
    const signup412Response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(user);
    expect(signup412Response.statusCode).toEqual(412);
    expect(signup412Response.body.message).toEqual(
      'Your retypePassword is not correct.',
    );
  });

  it('/auth/signup throw 400 ERROR if password is not have number character.', () => {
    const user: AuthCredentialDto = {
      email: 'sample@example.com',
      password: 'password%',
      retypePassword: 'password%',
    };
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send(user)
      .expect(400);
  });
});
