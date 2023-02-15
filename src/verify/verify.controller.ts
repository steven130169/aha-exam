import {
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  Res,
} from '@nestjs/common';
import { VerifyService } from './verify.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../auth/user.entity';

@Controller('verify')
export class VerifyController {
  constructor(
    private verifyService: VerifyService,
    private jwtService: JwtService,
  ) {}
  private logger = new Logger('verifyController');
  @Get(':token')
  async verifyEmail(
    @Param('token') token: string,
    @Res() res: Response,
  ): Promise<void> {
    let verifiedResult: UserEntity | string;
    try {
      const decoded = await this.jwtService.verify(token);
      this.logger.verbose(`Token parse successfully.`);
      verifiedResult = await this.verifyService.verifyEmail(decoded.email);
      //redirect dashboard
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }

    if (verifiedResult === `Email is verified`) {
      //redirect dashboard
    }
    if (verifiedResult === `Email did not exists`) {
      //redirect 400 BadRequest
    }
  }
}
