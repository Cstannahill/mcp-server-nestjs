import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

describe('PostsController', () => {
  let controller: PostsController;
  let service: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create on service', async () => {
    await controller.create(
      { title: 't', content: 'c' },
      { user: { userId: 1, username: 'u' } },
    );
    expect(service.create).toHaveBeenCalledWith(
      { title: 't', content: 'c' },
      1,
    );
  });

  it('should call findAll on service', async () => {
    await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should call findOne on service', async () => {
    await controller.findOne('2');
    expect(service.findOne).toHaveBeenCalledWith(2);
  });

  it('should call update on service', async () => {
    await controller.update(
      '3',
      { title: 't2' },
      { user: { userId: 2, username: 'u2' } },
    );
    expect(service.update).toHaveBeenCalledWith(3, { title: 't2' }, 2);
  });

  it('should call remove on service', async () => {
    await controller.remove('4', { user: { userId: 3, username: 'u3' } });
    expect(service.remove).toHaveBeenCalledWith(4, 3);
  });
});
