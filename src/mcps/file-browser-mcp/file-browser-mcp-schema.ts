// file-browser-mcp-schema.ts

export const fileBrowserSchema = {
  name: 'file_browser_mcp',
  version: '1.0.0',
  description: 'Simple MCP for basic filesystem operations',
  operations: {
    list_directory: {
      description: 'Lists files and directories in the specified path',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description:
              'Path to the directory to list. Relative to the base path.',
          },
        },
        required: ['path'],
      },
      returns: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            type: { type: 'string', enum: ['file', 'directory'] },
            size: { type: 'number' },
          },
        },
      },
    },
    read_file: {
      description: 'Reads the content of a file',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'Path to the file to read. Relative to the base path.',
          },
        },
        required: ['path'],
      },
      returns: {
        type: 'object',
        properties: {
          content: { type: 'string' },
          encoding: { type: 'string' },
        },
      },
    },
    write_file: {
      description: 'Writes content to a file',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description:
              'Path to the file to write. Relative to the base path.',
          },
          content: {
            type: 'string',
            description: 'Content to write to the file',
          },
          overwrite: {
            type: 'boolean',
            description: 'Whether to overwrite the file if it exists',
            default: false,
          },
        },
        required: ['path', 'content'],
      },
      returns: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
        },
      },
    },
  },
};
