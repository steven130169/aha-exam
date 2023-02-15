import {
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  Redirect,
} from '@nestjs/common';
import { VerifyService } from './verify.service';
import { JwtService } from '@nestjs/jwt';

@Controller('verify')
export class VerifyController {
  constructor(
    private verifyService: VerifyService,
    private jwtService: JwtService,
  ) {}
  private logger = new Logger('verifyController');
  @Get(':token')
  @Redirect('/auth/signin')
  async verifyEmail(@Param('token') token: string): Promise<void> {
    try {
      const decoded = await this.jwtService.verify(token);
      this.logger.verbose(`Token parse successfully.`);
      await this.verifyService.verifyEmail(decoded.email);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }
}
