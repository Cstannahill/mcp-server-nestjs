// file-browser-mcp.ts

import { promises as fs, Stats } from 'fs';
import { join, normalize, dirname, resolve } from 'path';
import { fileBrowserSchema } from './file-browser-mcp-schema';

export class FileBrowserMCP {
  private basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  // Method to get the schema definition
  getSchema() {
    return fileBrowserSchema;
  }

  // Main handler method that processes requests
  async handleRequest(
    operation: string,
    params: { path: string; content?: string; overwrite?: boolean },
  ): Promise<any> {
    // Validate the operation exists in our schema
    if (!fileBrowserSchema.operations[operation]) {
      throw new Error(`Unknown operation: ${operation}`);
    }

    // Route to the correct implementation
    switch (operation) {
      case 'list_directory':
        return this.listDirectory(params.path);
      case 'read_file':
        return this.readFile(params.path);
      case 'write_file':
        return this.writeFile(
          params.path,
          params.content ?? '',
          params.overwrite ?? false,
        );
      default:
        throw new Error(`Operation not implemented: ${operation}`);
    }
  }

  // Implementation of list_directory
  private async listDirectory(requestedPath: string): Promise<any> {
    try {
      const normalizedPath = normalize(requestedPath || '');
      const fullPath = resolve(this.basePath, normalizedPath);

      // Security check - ensure path is within the base path
      if (!fullPath.startsWith(this.basePath)) {
        throw new Error('Access denied: Path outside of allowed directory');
      }

      const entries = await fs.readdir(fullPath, { withFileTypes: true });

      const result = await Promise.all(
        entries.map(async (entry) => {
          const entryPath = join(fullPath, entry.name);
          let stats: Stats;

          try {
            stats = await fs.stat(entryPath);
          } catch {
            // If we can't stat the file, return minimal info
            return {
              name: entry.name,
              type: entry.isDirectory() ? 'directory' : 'file',
              size: 0,
            };
          }

          return {
            name: entry.name,
            type: entry.isDirectory() ? 'directory' : 'file',
            size: stats.size,
          };
        }),
      );

      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error listing directory: ${error.message}`);
        throw new Error(`Failed to list directory: ${error.message}`);
      }
      throw new Error('Failed to list directory: Unknown error');
    }
  }

  // Implementation of read_file
  private async readFile(requestedPath: string): Promise<any> {
    try {
      const normalizedPath = normalize(requestedPath || '');
      const fullPath = resolve(this.basePath, normalizedPath);

      // Security check - ensure path is within the base path
      if (!fullPath.startsWith(this.basePath)) {
        throw new Error('Access denied: Path outside of allowed directory');
      }

      const content = await fs.readFile(fullPath, 'utf8');

      return {
        content,
        encoding: 'utf8',
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error reading file: ${error.message}`);
        throw new Error(`Failed to read file: ${error.message}`);
      }
      throw new Error('Failed to read file: Unknown error');
    }
  }

  // Implementation of write_file
  private async writeFile(
    requestedPath: string,
    content: string,
    overwrite: boolean = false,
  ): Promise<any> {
    try {
      const normalizedPath = normalize(requestedPath || '');
      const fullPath = resolve(this.basePath, normalizedPath);

      // Security check - ensure path is within the base path
      if (!fullPath.startsWith(this.basePath)) {
        throw new Error('Access denied: Path outside of allowed directory');
      }

      // Check if file exists and handle overwrite flag
      try {
        const stat = await fs.stat(fullPath);
        if (stat.isFile() && !overwrite) {
          return {
            success: false,
            message: 'File already exists and overwrite is set to false',
          };
        }
      } catch {
        // File doesn't exist, we can proceed
        // Make sure the directory exists
        await fs.mkdir(dirname(fullPath), { recursive: true });
      }

      await fs.writeFile(fullPath, content, 'utf8');

      return {
        success: true,
        message: 'File written successfully',
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error writing file: ${error.message}`);
        throw new Error(`Failed to write file: ${error.message}`);
      }
      throw new Error('Failed to write file: Unknown error');
    }
  }
}
