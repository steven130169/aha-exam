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
    await authService.createUser(email, password);
    expect(await userRepository.findOneBy({ email })).toMatchObject({ email });
  });
  it('should be throw error if email is duplicate', async function () {
    const sameEmail = 'sample@example.com';
    await authService.createUser(email, password);
    await expect(authService.createUser(sameEmail, password)).rejects.toThrow(
      'This email already exists.',
    );
  });
});
