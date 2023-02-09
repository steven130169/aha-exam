import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}
  async createUser(email: string, password: string): Promise<void> {
    //crypt password
    const genSalt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, genSalt);
    //inject user repository
    const user = await this.userRepository.create({
      email: email,
      password: hashedPassword,
    });

    //save into database
    await this.userRepository.save(user);
  }
}
