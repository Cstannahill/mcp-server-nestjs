import { Test, TestingModule } from '@nestjs/testing';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { Readable } from 'stream';

describe('FileController', () => {
  let controller: FileController;
  let service: {
    uploadFile: jest.Mock;
    getFile: jest.Mock;
    deleteFile: jest.Mock;
    listFiles: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      uploadFile: jest.fn(),
      getFile: jest.fn(),
      deleteFile: jest.fn(),
      listFiles: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileController],
      providers: [
        {
          provide: FileService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<FileController>(FileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call uploadFile on service', () => {
    const mockReadable = new Readable();
    mockReadable.push(Buffer.from('abc'));
    mockReadable.push(null);

    const file: Express.Multer.File = {
      originalname: 'test.txt',
      buffer: Buffer.from('abc'),
      fieldname: 'file',
      encoding: '7bit',
      mimetype: 'text/plain',
      size: 3,
      stream: mockReadable,
      destination: '',
      filename: '',
      path: '',
    };

    controller.uploadFile(file);
    expect(service.uploadFile).toHaveBeenCalledWith(file);
  });

  it('should call getFile on service', () => {
    controller.getFile('id');
    expect(service.getFile).toHaveBeenCalledWith('id');
  });

  it('should call deleteFile on service', () => {
    controller.deleteFile('id');
    expect(service.deleteFile).toHaveBeenCalledWith('id');
  });
});
