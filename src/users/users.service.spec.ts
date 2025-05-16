import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

// Create a type-safe mock repository factory
function createMockRepository(): Record<string, jest.Mock> {
  return {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };
}

describe('UsersService', () => {
  let service: UsersService;
  let userRepo: Record<string, jest.Mock>;

  beforeEach(async () => {
    userRepo = createMockRepository();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: userRepo },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should call find', async () => {
    userRepo.find.mockResolvedValue([{ id: 1 }]);
    const result = await service.findAll();
    expect(userRepo.find).toHaveBeenCalled();
    expect(result).toEqual([{ id: 1 }]);
  });

  it('findOne should return user if found', async () => {
    userRepo.findOneBy.mockResolvedValue({ id: 1 });
    const result = await service.findOne(1);
    expect(userRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(result).toEqual({ id: 1 });
  });

  it('findOne should throw if not found', async () => {
    userRepo.findOneBy.mockResolvedValue(null);
    await expect(service.findOne(1)).rejects.toThrow();
  });

  it('findByEmail should return user if found', async () => {
    userRepo.findOneBy.mockResolvedValue({ id: 2, email: 'a@b.com' });
    const result = await service.findByEmail('a@b.com');
    expect(userRepo.findOneBy).toHaveBeenCalledWith({ email: 'a@b.com' });
    expect(result).toEqual({ id: 2, email: 'a@b.com' });
  });

  it('findByEmail should throw if not found', async () => {
    userRepo.findOneBy.mockResolvedValue(null);
    await expect(service.findByEmail('a@b.com')).rejects.toThrow();
  });

  it('create should call create and save', async () => {
    const dto = { name: 'n', email: 'e', password: 'p' };
    userRepo.create.mockReturnValue(dto);
    userRepo.save.mockResolvedValue({ id: 3, ...dto });
    const result = await service.create(dto);
    expect(userRepo.create).toHaveBeenCalledWith(dto);
    expect(userRepo.save).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ id: 3, ...dto });
  });

  it('remove should call delete', async () => {
    userRepo.delete.mockResolvedValue(undefined);
    await service.remove(1);
    expect(userRepo.delete).toHaveBeenCalledWith(1);
  });
});
