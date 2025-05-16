import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from './file.service';
import { FileBrowserMCP } from '../mcps/file-browser-mcp/file-browser-mcp';
import { Readable } from 'stream';

class FileBrowserMCPMock {
  handleRequest = jest.fn();
}

interface FileResponse {
  content: string;
  encoding: string;
}

interface FileListItem {
  name: string;
  type: string;
  size: number;
}

interface SuccessResponse {
  success: boolean;
}

describe('FileService', () => {
  let service: FileService;
  let mcp: FileBrowserMCPMock;

  beforeEach(async () => {
    mcp = new FileBrowserMCPMock();
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileService, { provide: FileBrowserMCP, useValue: mcp }],
    }).compile();

    service = module.get<FileService>(FileService);
    // Override the service's mcp with our mock
    Object.defineProperty(service, 'mcp', { value: mcp });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call MCP write_file on uploadFile', async () => {
    const mockReadable = new Readable();
    mockReadable.push(Buffer.from('hello'));
    mockReadable.push(null);

    const file: Express.Multer.File = {
      originalname: 'test.txt',
      buffer: Buffer.from('hello'),
      fieldname: 'file',
      encoding: '7bit',
      mimetype: 'text/plain',
      size: 5,
      stream: mockReadable,
      destination: '',
      filename: '',
      path: '',
    };

    const mockResponse: SuccessResponse = { success: true };
    mcp.handleRequest.mockResolvedValue(mockResponse);

    // Use type assertion to fix unsafe assignment
    const result = (await service.uploadFile(file)) as SuccessResponse;

    expect(mcp.handleRequest).toHaveBeenCalledWith(
      'write_file',
      expect.objectContaining({
        path: 'test.txt',
        content: 'hello',
        overwrite: true,
      }),
    );
    expect(result).toEqual(mockResponse);
  });

  it('should call MCP read_file on getFile', async () => {
    const mockResponse: FileResponse = { content: 'abc', encoding: 'utf8' };
    mcp.handleRequest.mockResolvedValue(mockResponse);

    // Use type assertion to fix unsafe assignment
    const result = (await service.getFile('test.txt')) as FileResponse;

    expect(mcp.handleRequest).toHaveBeenCalledWith('read_file', {
      path: 'test.txt',
    });
    expect(result).toEqual(mockResponse);
  });

  it('should call MCP list_directory on listFiles', async () => {
    const mockResult: FileListItem[] = [
      { name: 'a.txt', type: 'file', size: 1 },
    ];

    mcp.handleRequest.mockResolvedValue(mockResult);
    const result = (await service.listFiles()) as FileListItem[];

    expect(mcp.handleRequest).toHaveBeenCalledWith('list_directory', {
      path: '',
    });
    expect(result).toEqual(mockResult);
  });

  it('should call MCP delete_file on deleteFile', async () => {
    const mockResponse: SuccessResponse = { success: true };
    mcp.handleRequest.mockResolvedValue(mockResponse);

    const result = await service.deleteFile('test.txt');

    expect(mcp.handleRequest).toHaveBeenCalledWith('delete_file', {
      path: 'test.txt',
    });
    expect(result).toEqual(mockResponse);
  });
});
