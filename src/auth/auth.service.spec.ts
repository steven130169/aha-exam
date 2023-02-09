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

  it('should be create user successful', async () => {
    const email = 'sample@example.com';
    const password = 'password';
    await authService.createUser(email, password);
    expect(await userRepository.findOneBy({ email })).toMatchObject({ email });
  });
});
