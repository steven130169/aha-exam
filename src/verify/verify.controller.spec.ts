import { Test, TestingModule } from '@nestjs/testing';
import { VerifyController } from './verify.controller';
import { VerifyService } from './verify.service';
import { JwtModule, JwtService } from '@nestjs/jwt';

describe('VerifyController', () => {
  let controller: VerifyController;
  let verifyService: VerifyService;
  let jwtService: JwtService;
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
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be verified email if this email is already signUp.', async function () {
    //TODO:
    // The User Process:
    // when user click verify url
    // parse token get email
    // ask database if this email has verified?
    // if true return the user dashboard.( redirect sign in)
    // else return "Resend Email Verification" button html.

    const email = 'sample@example.com';
    const accessToken = jwtService.sign({ email });
    await controller.verifyEmail(accessToken);
    expect(verifyService.verifyEmail).toHaveBeenCalled();
  });
});
