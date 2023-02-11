import {
  Body,
  Controller,
  Post,
  PreconditionFailedException,
} from '@nestjs/common';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { AuthService } from './auth.service';
import { AuthSignInDto } from './dto/auth-signIn.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() authCredentialDto: AuthCredentialDto): Promise<void> {
    if (authCredentialDto.password !== authCredentialDto.retypePassword) {
      throw new PreconditionFailedException(
        'Your retypePassword is not correct.',
      );
    }
    await this.authService.signUp(
      authCredentialDto.email,
      authCredentialDto.password,
    );
  }

  @Post('signin')
  async signIn(
    @Body() authSignInDto: AuthSignInDto,
  ): Promise<{ accessToken: string }> {
    return await this.authService.signIn(authSignInDto);
  }
}
