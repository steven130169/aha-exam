import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from '../auth/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class VerifyService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}
  async verifyEmail(email: string): Promise<UserEntity | string> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      return `Email did not exists`;
    }
    if (user.isVerified) {
      return `Email is verified`;
    }
    user.isVerified = true;
    return await this.userRepository.save(user);
  }
}
