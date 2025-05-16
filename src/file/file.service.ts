// src/file/file.service.ts
import { Injectable } from '@nestjs/common';
import { FileBrowserMCP } from '../mcps/file-browser-mcp/file-browser-mcp';

@Injectable()
export class FileService {
  private readonly mcp: FileBrowserMCP;

  constructor() {
    // Use S drive as the base path
    this.mcp = new FileBrowserMCP('s:/');
  }

  async uploadFile(file: Express.Multer.File): Promise<unknown> {
    // Save file to S drive using MCP
    return this.mcp.handleRequest('write_file', {
      path: file.originalname,
      content: file.buffer.toString('utf8'),
      overwrite: true,
    }) as Promise<unknown>;
  }

  async getFile(fileId: string): Promise<unknown> {
    // Read file from S drive using MCP
    return this.mcp.handleRequest('read_file', {
      path: fileId,
    }) as Promise<unknown>;
  }

  async deleteFile(fileId: string): Promise<unknown> {
    // Delete file from S drive using MCP
    return this.mcp.handleRequest('delete_file', {
      path: fileId,
    }) as Promise<unknown>;
  }

  async listFiles(): Promise<unknown[]> {
    const result: unknown = await this.mcp.handleRequest('list_directory', {
      path: '',
    });
    return result as unknown[];
  }

  // Add other methods as needed
}
