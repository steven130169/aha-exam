import { Test, TestingModule } from '@nestjs/testing';
import { VerifyController } from './verify.controller';
import { VerifyService } from './verify.service';

describe('VerifyController', () => {
  let controller: VerifyController;
  let verifyService: VerifyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VerifyController],
      providers: [
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
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be verify email if this email is already signUp.', async function () {
    //TODO:
    // The User Process:
    // when user click verify url
    // parse token get email
    // ask database if this email has verified?
    // if true return the user dashboard.
    // else return "Resend Email Verification" button html.

    const accessToken = 'token';
    await controller.verifyEmail(accessToken);
    expect(verifyService.verifyEmail).toHaveBeenCalled();
  });
});
