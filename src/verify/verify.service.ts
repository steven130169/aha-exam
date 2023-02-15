import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from '../auth/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class VerifyService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}
  async verifyEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new BadRequestException(`This email: ${email} didn't exists.`);
    }
    if (user.isVerified) {
      throw new BadRequestException(
        `This email: ${email} already have verified.`,
      );
    }
    user.isVerified = true;
    return await this.userRepository.save(user);
  }
}
