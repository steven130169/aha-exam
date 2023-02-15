import { Test, TestingModule } from '@nestjs/testing';
import { VerifyController } from './verify.controller';
import { VerifyService } from './verify.service';
import { JwtModule, JwtService } from '@nestjs/jwt';

describe('VerifyController', () => {
  let controller: VerifyController;
  let verifyService: VerifyService;
  let jwtService: JwtService;
  let res;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test_secret',
          signOptions: {
            expiresIn: 3600,
          },
        }),
      ],
      controllers: [VerifyController],
      providers: [
        { provide: JwtService, useValue: jwtService },
        {
          provide: VerifyService,
          useValue: {
            verifyEmail: jest.fn(),
          },
        },
      ],
    }).compile();
    controller = module.get<VerifyController>(VerifyController);
    verifyService = module.get(VerifyService);
    jwtService = module.get(JwtService);
    res = {
      redirect: jest.fn(),
    };
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be verified email if this email is already signUp.', async function () {
    const email = 'sample@example.com';
    const accessToken = jwtService.sign({ email });
    await controller.verifyEmail(accessToken, res);
    expect(verifyService.verifyEmail).toHaveBeenCalled();
  });

  it('should redirect to dashboard when email already have verified.', async function () {
    const email = 'sample@example.com';
    const accessToken = jwtService.sign({ email });
    verifyService.verifyEmail = jest
      .fn()
      .mockResolvedValue(`Email is verified`);
    await controller.verifyEmail(accessToken, res);
    expect(res.redirect).toHaveBeenCalled();
  });
});
