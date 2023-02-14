import {
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
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
  async verifyEmail(@Param('token') token: string): Promise<any> {
    try {
      const decoded = await this.jwtService.verify(token);
      this.logger.verbose(`Token parse successfully.`);
      this.verifyService.verifyEmail(decoded.email);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
    return undefined;
  }
}
