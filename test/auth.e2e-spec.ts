import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthCredentialDto } from '../src/auth/dto/auth-credential.dto';
import { Repository } from 'typeorm';
import { UserEntity } from '../src/auth/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthSignInDto } from '../src/auth/dto/auth-signIn.dto';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<UserEntity>;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    userRepository = moduleFixture.get(getRepositoryToken(UserEntity));
  });
  let authCredentialDto: AuthCredentialDto;
  beforeEach(async () => {
    await userRepository.delete({});
    authCredentialDto = {
      email: 'a09930185@gmail.com',
      password: 'Password5%',
      retypePassword: 'Password5%',
    };
  });
  afterAll(async () => {
    await app.close();
  });
  it('/auth/signup', async () => {
    const signupResponse = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(authCredentialDto);
    expect(signupResponse.statusCode).toEqual(201);
  });

  it('/auth/signup throw 412 ERROR if password and retypePassword not same.', async () => {
    authCredentialDto.retypePassword = 'Password5%^';
    const signup412Response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(authCredentialDto);
    expect(signup412Response.statusCode).toEqual(412);
    expect(signup412Response.body.message).toEqual(
      'Your retypePassword is not correct.',
    );
  });

  it('/auth/signup throw 400 ERROR if password is not have number character.', () => {
    authCredentialDto.password = 'password%';
    authCredentialDto.retypePassword = 'password%';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send(authCredentialDto)
      .expect(400);
  });
  it('/auth/signin return jwtToken success.', async function () {
    const authSignInDto: AuthSignInDto = {
      email: authCredentialDto.email,
      password: authCredentialDto.password,
    };
    const signUpResponse = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(authCredentialDto);
    expect(signUpResponse.statusCode).toEqual(201);
    const signInResponse = await request(app.getHttpServer())
      .post('/auth/signin')
      .send(authSignInDto);
    expect(signInResponse.statusCode).toEqual(200);
    expect(signInResponse.body.accessToken).toBeDefined();
  });
});
