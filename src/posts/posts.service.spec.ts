import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { User } from '../users/entities/user.entity';
import { Repository, ObjectLiteral } from 'typeorm';

// Create a type-safe mock repository factory
function createMockRepository<T extends ObjectLiteral>(): Partial<
  Record<keyof Repository<T>, jest.Mock>
> {
  return {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    delete: jest.fn(),
  };
}

describe('PostsService', () => {
  let service: PostsService;
  let postRepo: Record<string, jest.Mock>;
  let userRepo: Record<string, jest.Mock>;

  beforeEach(async () => {
    postRepo = createMockRepository<Post>();
    userRepo = createMockRepository<User>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: getRepositoryToken(Post), useValue: postRepo },
        { provide: getRepositoryToken(User), useValue: userRepo },
      ],
    }).compile();
    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should call find', async () => {
    postRepo.find.mockResolvedValue([{ id: 1 }]);
    const result = await service.findAll();
    expect(postRepo.find).toHaveBeenCalledWith({ relations: ['author'] });
    expect(result).toEqual([{ id: 1 }]);
  });

  it('findOne should return post if found', async () => {
    postRepo.findOne.mockResolvedValue({ id: 1, author: { id: 2 } });
    const result = await service.findOne(1);
    expect(postRepo.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['author'],
    });
    expect(result).toEqual({ id: 1, author: { id: 2 } });
  });

  it('findOne should throw if not found', async () => {
    postRepo.findOne.mockResolvedValue(null);
    await expect(service.findOne(1)).rejects.toThrow();
  });

  it('create should throw if user not found', async () => {
    userRepo.findOneBy.mockResolvedValue(null);
    await expect(
      service.create({ title: 't', content: 'c' }, 1),
    ).rejects.toThrow();
  });

  it('create should call create and save if user found', async () => {
    userRepo.findOneBy.mockResolvedValue({ id: 2 });
    postRepo.create.mockReturnValue({
      title: 't',
      content: 'c',
      author: { id: 2 },
    });
    postRepo.save.mockResolvedValue({
      id: 3,
      title: 't',
      content: 'c',
      author: { id: 2 },
    });
    const result = await service.create({ title: 't', content: 'c' }, 2);
    expect(postRepo.create).toHaveBeenCalledWith({
      title: 't',
      content: 'c',
      author: { id: 2 },
    });
    expect(postRepo.save).toHaveBeenCalled();
    expect(result).toEqual({
      id: 3,
      title: 't',
      content: 'c',
      author: { id: 2 },
    });
  });
});
