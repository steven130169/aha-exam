import { Test, TestingModule } from '@nestjs/testing';
import { VerifyService } from './verify.service';
import { UserEntity } from '../auth/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';

describe('VerifyService', () => {
  let userRepository: {
    save: jest.Mock<any, any>;
    create: jest.Mock<any, any>;
    findOneBy: jest.Mock<any, any>;
  };
  let service: VerifyService;
  beforeEach(async () => {
    userRepository = {
      findOneBy: jest.fn(),
      save: jest.fn().mockImplementationOnce(() => {
        return Promise.resolve();
      }),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VerifyService,
        { useValue: userRepository, provide: getRepositoryToken(UserEntity) },
      ],
    }).compile();

    service = module.get<VerifyService>(VerifyService);
    userRepository = module.get(getRepositoryToken(UserEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be verified email successfully.', async function () {
    const email = 'sample@example.com';
    userRepository.findOneBy.mockResolvedValue({ email, isVerified: false });
    await service.verifyEmail(email);
    expect(userRepository.findOneBy).toHaveBeenCalled();
    expect(userRepository.save).toHaveBeenCalled();
  });

  it('should throw BadRequestException when email already have verified.', async function () {
    const email = 'sample@example.com';
    userRepository.findOneBy.mockResolvedValue({ email, isVerified: true });
    await expect(service.verifyEmail(email)).rejects.toThrow(
      BadRequestException,
    );
    await expect(service.verifyEmail(email)).rejects.toThrow(
      `This email: ${email} already have verified.`,
    );
  });

  it('should throw BadRequestException when email did not exists.', async function () {
    const email = 'sample@example.com';
    userRepository.findOneBy.mockResolvedValue(null);
    await expect(service.verifyEmail(email)).rejects.toThrow(
      BadRequestException,
    );
    await expect(service.verifyEmail(email)).rejects.toThrow(
      `This email: ${email} didn't exists.`,
    );
  });
});
