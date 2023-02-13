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

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService', { timestamp: true });

  constructor(
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
        throw new ConflictException('This mail is already exists.');
      } else {
        throw new InternalServerErrorException();
      }
    }
    //TODO after created user need to send verify email
    // 1. gen verify token
    // 2. send verify email
  }

  async signIn(authSignInDto: AuthSignInDto): Promise<{ accessToken: string }> {
    const { email, password } = authSignInDto;

    let user: UserEntity;
    try {
      user = await this.userRepository.findOneBy({ email });
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayloadInterface = { email };
      const accessToken: string = this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException();
    }
  }
}
