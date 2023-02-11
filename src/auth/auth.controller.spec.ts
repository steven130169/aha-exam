import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { AuthSignInDto } from './dto/auth-signIn.dto';

const mockAuthService = {
  signUp: jest.fn(),
};
describe('AuthController', () => {
  let controller: AuthController;

  let service: AuthService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: AuthService, useValue: mockAuthService }],
      controllers: [AuthController],
    }).compile();
    controller = module.get<AuthController>(AuthController);
    service = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('use auth-credentials to SignUp', async function () {
    const authCredentialDto: AuthCredentialDto = {
      email: 'sample@example.com',
      password: 'password',
      retypePassword: 'password',
    };
    await controller.signUp(authCredentialDto);
    expect(service.signUp).toHaveBeenCalled();
  });
  it('should be throw 412 error if user retypePassword is incorrect.', function () {
    const authCredentialDtoNOTCorrect: AuthCredentialDto = {
      email: 'sample@example.com',
      password: 'password',
      retypePassword: '1password',
    };
    expect(controller.signUp(authCredentialDtoNOTCorrect)).rejects.toThrow(
      'Your retypePassword is not correct.',
    );
  });
  it('should be sign in successful', function () {
    const authSignInDto: AuthSignInDto = {
      email: 'sample@example.com',
      password: 'Password%5',
    };

    expect(controller.signIn(authSignInDto)).toEqual({ accessToken: 'string' });
  });
});
