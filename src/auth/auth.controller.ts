import {
  Body,
  Controller,
  HttpCode,
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
    return this.authService.signUp(
      authCredentialDto.email,
      authCredentialDto.password,
    );
  }

  @Post('signin')
  @HttpCode(200)
  async signIn(
    @Body() authSignInDto: AuthSignInDto,
  ): Promise<{ accessToken: string }> {
    const accessToken = await this.authService.signIn(authSignInDto);
    return { accessToken };
  }
}
