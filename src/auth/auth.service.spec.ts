import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

class UserEntity {
  email: string;
  password: string;
}

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be create user successful', () => {
    const email = 'sample@example.com';
    const password = 'password';
    const user: UserEntity = {
      email: email,
      password: password,
    };
    expect(authService.createUser(email, password)).toEqual(user);
  });
});
