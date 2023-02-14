import { Test, TestingModule } from '@nestjs/testing';
import { VerifyService } from './verify.service';
import { UserEntity } from '../auth/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('VerifyService', () => {
  let service: VerifyService;
  let userRepository = {
    findOneBy: jest.fn(),
    save: jest.fn().mockImplementationOnce(() => {
      return Promise.resolve();
    }),
    create: jest.fn(),
  };

  beforeEach(async () => {
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
    await service.verifyEmail('sample@example.com');
    expect(userRepository.findOneBy).toHaveBeenCalled();
  });
});
