import * as bcrypt from 'bcrypt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserEntity } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryFailedError } from 'typeorm';
import { AuthSignInDto } from './dto/auth-signIn.dto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository;
  let jwtService;
  let mailService: MailService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: JwtService,
          useValue: { sign: jest.fn() },
        },
        AuthService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
        {
          provide: MailService,
          useValue: {
            sendVerification: jest.fn(),
          },
        },
      ],
    }).compile();
    authService = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(UserEntity));
    jwtService = module.get<JwtService>(JwtService);
    mailService = module.get(MailService);
  });
  const email = 'sample@example.com';
  const password = 'password';
  const mockUserRepository = {
    findOneBy: jest.fn().mockReturnValue({ email }),
    save: jest.fn().mockImplementationOnce(() => {
      return Promise.resolve();
    }),
    create: jest.fn().mockReturnValue({ email }),
  };
  it('should be create user successful', async () => {
    await authService.signUp(email, password);
    expect(await userRepository.findOneBy({ email })).toMatchObject({ email });
    expect(jwtService.sign).toHaveBeenCalled();
    expect(mailService.sendVerification).toHaveBeenCalled();
  });
  it('should be throw error if mail is duplicate', async function () {
    const sameEmail = 'sample@example.com';
    mockUserRepository.save = jest.fn().mockImplementationOnce(() => {
      throw new QueryFailedError(`Query String`, undefined, {
        code: '23505',
      });
    });
    await expect(authService.signUp(sameEmail, password)).rejects.toThrow(
      `This email is already exists.`,
    );
  });
  it('should be find one user successful', async function () {
    const authSignInDto: AuthSignInDto = {
      email: email,
      password: password,
    };
    const genSalt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, genSalt);

    mockUserRepository.findOneBy = jest.fn().mockResolvedValue({
      email: email,
      password: hashedPassword,
      isVerified: false,
    });
    await authService.signIn(authSignInDto);
    expect(jwtService.sign).toHaveBeenCalledTimes(1);
  });

  it('should throw new Error : this email did not verified', async function () {
    const authSignInDto: AuthSignInDto = {
      email: email,
      password: password,
    };
    const genSalt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, genSalt);

    mockUserRepository.findOneBy = jest.fn().mockResolvedValue({
      email: email,
      password: hashedPassword,
      isVerified: false,
    });
    await expect(authService.signIn(authSignInDto)).rejects.toThrow(
      `This email: ${authSignInDto.email} didn't have verified.`,
    );
  });
});
