import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class MailService {
  private logger = new Logger('MailService');
  constructor(private configService: ConfigService) {}
  async sendVerification(email: string, token: string): Promise<void> {
    const domainName = this.configService.get('server.domainName');
    const verifyUrl = `http://${domainName}:3000/verify?token=${token}`;
    sgMail.setApiKey(this.configService.get('sendGridKey'));
    try {
      await sgMail.send({
        to: email,
        from: 'steven@chiwencheng.com',
        subject: `Verify your email`,
        text: `Please click this link ${verifyUrl} to verify your email.`,
        html: `<p>Please click <a href="${verifyUrl}"> this link </a> to verify your email.</p>`,
      });
      this.logger.verbose(`Mail is already sent to ${email} successfully.`);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException(
        `SendGrid sent to ${email} failed.`,
      );
    }
  }
}
