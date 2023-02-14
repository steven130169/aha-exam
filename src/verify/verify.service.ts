import { Injectable } from '@nestjs/common';

@Injectable()
export class VerifyService {
  verifyEmail(email: string) {
    // const user= await this.userRepository.findOneBy({email});
    return undefined;
  }
}
