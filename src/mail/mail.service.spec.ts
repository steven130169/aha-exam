import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { MailerService } from '@nestjs-modules/mailer';

describe('EmailService', () => {
  let mailService: MailService;

  let mailerService: MailerService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        { provide: MailerService, useValue: { sendMail: jest.fn() } },
      ],
    }).compile();

    mailService = module.get<MailService>(MailService);
    mailerService = module.get(MailerService);
  });

  it('should be defined', () => {
    expect(mailService).toBeDefined();
  });
  describe('Email verification ', function () {
    it('should be successful send signUp email', async function () {
      const email = 'sample@example.com';
      const token = 'sampleToken';
      await mailService.sendVerification(email, token);
      expect(mailerService.sendMail).toHaveBeenCalledTimes(1);
      expect(mailerService.sendMail).toHaveBeenCalledWith({});
    });
  });
});
