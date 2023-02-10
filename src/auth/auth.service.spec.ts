import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserEntity } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Repository<UserEntity>;
  let datasource: DataSource;
  beforeAll(async () => {
    datasource = new DataSource({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [UserEntity],
      synchronize: true,
    });
    await datasource.initialize();
    userRepository = datasource.getRepository(UserEntity);
  });
  beforeEach(async () => {
    await userRepository.delete({});
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(UserEntity), useValue: userRepository },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });
  afterAll(async () => {
    await datasource.destroy();
  });

  const email = 'sample@example.com';
  const password = 'password';
  it('should be create user successful', async () => {
    await authService.signUp(email, password);
    expect(await userRepository.findOneBy({ email })).toMatchObject({ email });
  });
  it('should be throw error if email is duplicate', async function () {
    const sameEmail = 'sample@example.com';
    await authService.signUp(email, password);
    await expect(authService.signUp(sameEmail, password)).rejects.toThrow(
      `This email is already exists.`,
    );
  });
  it('should be find one user successful', async function () {
    await authService.signUp(email, password);
    expect(await authService.signIn(email, password)).toEqual('accessToken');
  });
});
