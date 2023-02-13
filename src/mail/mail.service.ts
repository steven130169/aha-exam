import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}
  async sendVerification(email: string, token: string): Promise<void> {
    //TODO need to use configService and change localhost to base_url maybe http & 3000port also need to use.
    const domainName = this.configService.get('server.domainName');
    const verifyUrl = `http://${domainName}:3000/verify?token=${token}`;
    await this.mailerService.sendMail({
      to: email,
      subject: `Verify your email`,
      text: `Please click this link ${verifyUrl} to verify your email.`,
      html: `<p>Please click <a href="${verifyUrl}"> this link </a> to verify your email.</p>`,
    });
  }
}
