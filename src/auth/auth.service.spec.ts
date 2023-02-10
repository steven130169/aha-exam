import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserEntity } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryFailedError } from 'typeorm';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository;
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
  const email = 'sample@example.com';
  const password = 'password';
  const mockUserRepository = {
    findOneBy: jest.fn().mockReturnValue({ email }),
    save: jest.fn().mockImplementationOnce(() => {
      return Promise.resolve();
    }),
    create: jest.fn().mockReturnValue({ email }),
  };
  it('should be create user successful', async () => {
    await authService.signUp(email, password);
    expect(await userRepository.findOneBy({ email })).toMatchObject({ email });
  });
  it('should be throw error if email is duplicate', async function () {
    const sameEmail = 'sample@example.com';
    mockUserRepository.save = jest.fn().mockImplementationOnce(() => {
      throw new QueryFailedError(`Query String`, undefined, {
        code: '23505',
      });
    });
    await expect(authService.signUp(sameEmail, password)).rejects.toThrow(
      `This email is already exists.`,
    );
  });
  it('should be find one user successful', async function () {
    await authService.signUp(email, password);
    expect(await authService.signIn(email, password)).toEqual('accessToken');
  });
});
