import { Controller, Get, Param } from '@nestjs/common';

@Controller('verify')
export class VerifyController {
  @Get(':token')
  async verifyEmail(@Param('token') token: string): Promise<any> {
    return undefined;
  }
}
