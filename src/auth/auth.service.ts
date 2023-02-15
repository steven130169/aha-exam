import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthSignInDto } from './dto/auth-signIn.dto';
import { JwtPayloadInterface } from './jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService', { timestamp: true });

  constructor(
    private mailService: MailService,
    private jwtService: JwtService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async signUp(email: string, password: string): Promise<void> {
    //crypt password
    const genSalt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, genSalt);
    //inject user repository
    const user = await this.userRepository.create({
      email: email,
      password: hashedPassword,
    });

    //save into database
    try {
      this.logger.verbose(`database save ${JSON.stringify(user)}`);
      await this.userRepository.save(user);
    } catch (e) {
      if (e.code === 'SQLITE_CONSTRAINT' || '23505') {
        throw new ConflictException('This email is already exists.');
      } else {
        throw new InternalServerErrorException();
      }
    }
    const token = this.generateJwtAccessToken(email);
    await this.mailService.sendVerification(email, token);
  }

  async signIn(authSignInDto: AuthSignInDto): Promise<string> {
    const { email, password } = authSignInDto;

    let user: UserEntity;
    try {
      user = await this.userRepository.findOneBy({ email });
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
    if (user && (await bcrypt.compare(password, user.password))) {
      return this.generateJwtAccessToken(email);
    } else {
      throw new UnauthorizedException();
    }
  }

  generateJwtAccessToken(email: string): string {
    const payload: JwtPayloadInterface = { email };
    return this.jwtService.sign(payload);
  }
}
