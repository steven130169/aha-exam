import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './user.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService', { timestamp: true });

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private datasource: DataSource,
  ) {}

  async signUp(email: string, password: string): Promise<void> {
    await this.datasource;
    this.logger.log(this.datasource);
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
      await this.userRepository.save(user);
    } catch (e) {
      if (e.code === 'SQLITE_CONSTRAINT' || '23505') {
        throw new ConflictException('This email is already exists.');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(email: string, password: string) {
    return undefined;
  }
}
