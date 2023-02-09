import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserEntity } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const mockUserRepository = {
  save: jest.fn(),
  create: jest.fn(),
};
describe('AuthService', () => {
  let authService: AuthService;

  let userRepository: Repository<UserEntity>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
      ],
    }).compile();
    authService = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(UserEntity));
  });

  it('should be create user successful', async () => {
    const email = 'sample@example.com';
    const password = 'password';
    await authService.createUser(email, password);
    expect(userRepository.create).toHaveBeenCalled();
    expect(userRepository.save).toHaveBeenCalled();
  });
});
