import {
  BadRequestException,
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
import { Response } from 'express';

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
    const decoded = await this.jwtService.verify(token);
    this.logger.verbose(`Token parse successfully.`);
    try {
      verifiedResult = await this.verifyService.verifyEmail(decoded.email);
      res.redirect(`/dashboard`);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }

    if (verifiedResult === `Email is verified`) {
      res.redirect(`/dashboard`);
    }
    if (verifiedResult === `Email did not exists`) {
      throw new BadRequestException(`Email ${decoded.email} is not exists.`);
    }
  }
}
