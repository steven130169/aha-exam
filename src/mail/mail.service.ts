import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  async sendVerification(email: string, token: string): Promise<any> {
    return undefined;
  }
}
