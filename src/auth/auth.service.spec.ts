import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<Pick<UsersService, 'findByEmail' | 'create'>>;
  let jwtService: jest.Mocked<Pick<JwtService, 'sign'>>;

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };
    jwtService = {
      sign: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('validateUser returns user if password matches', async () => {
    const mockUser = {
      password: await bcrypt.hash('pw', 10),
      email: 'e',
      id: 1,
    } as User;

    usersService.findByEmail.mockResolvedValue(mockUser);
    // Properly mock bcrypt compare with void return type
    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation(() => Promise.resolve(true) as unknown as never);

    const result = await service.validateUser('e', 'pw');
    expect(result).toBeDefined();
  });

  it('validateUser returns null if user not found', async () => {
    usersService.findByEmail.mockImplementation(() => {
      throw new NotFoundException('User not found');
    });
    const result = await service.validateUser('e', 'pw');
    expect(result).toBeNull();
  });

  it('login returns access_token', () => {
    jwtService.sign.mockReturnValue('token');
    const mockUser: Partial<User> = { id: 1, email: 'e' };
    const result = service.login(mockUser as User);
    expect(result).toEqual({ access_token: 'token' });
  });
});

// Adding missing NotFoundException class
class NotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundException';
  }
}
