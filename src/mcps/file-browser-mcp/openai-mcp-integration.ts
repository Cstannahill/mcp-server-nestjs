// openai-mcp-integration.ts

import OpenAI from 'openai';
import { FileBrowserMCP } from './file-browser-mcp';

export class MCPIntegration {
  private openai: OpenAI;
  private fileBrowserMCP: FileBrowserMCP;

  constructor(apiKey: string, basePath: string) {
    this.openai = new OpenAI({ apiKey });
    this.fileBrowserMCP = new FileBrowserMCP(basePath);
  }

  // Helper method to extract tool calls from OpenAI response
  private extractToolCalls(
    message: OpenAI.Chat.Completions.ChatCompletionMessage,
  ): OpenAI.Chat.Completions.ChatCompletionMessageToolCall[] {
    if (!message.tool_calls || !Array.isArray(message.tool_calls)) {
      return [];
    }
    return message.tool_calls;
  }

  // Method to handle tool call execution
  private async executeToolCall(
    toolCall: OpenAI.Chat.Completions.ChatCompletionMessageToolCall,
  ): Promise<unknown> {
    try {
      if (
        !toolCall.function ||
        typeof toolCall.function.arguments !== 'string' ||
        typeof toolCall.function.name !== 'string'
      ) {
        throw new Error('Invalid toolCall structure');
      }
      // Use type assertion to avoid unsafe any assignment and fix formatting
      const args = JSON.parse(toolCall.function.arguments) as Record<
        string,
        unknown
      >;
      const functionName = toolCall.function.name;
      if (functionName.startsWith('file_browser_')) {
        const operation = functionName.replace('file_browser_', '');
        return await this.fileBrowserMCP.handleRequest(
          operation,
          args as { path: string; content?: string; overwrite?: boolean },
        );
      }
      throw new Error(`Unknown function: ${functionName}`);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error executing tool call: ${error.message}`);
        return { error: error.message };
      }
      return { error: 'Unknown error' };
    }
  }

  // Main method to process a user message
  async processMessage(
    userMessage: string,
    conversationHistory: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [],
  ): Promise<{
    content: string;
    toolCalls: OpenAI.Chat.Completions.ChatCompletionMessageToolCall[];
    toolResults: unknown[];
  }> {
    try {
      const tools: OpenAI.Chat.Completions.ChatCompletionTool[] =
        Object.entries(this.fileBrowserMCP.getSchema().operations).map(
          ([key, value]) => ({
            type: 'function',
            function: {
              name: `file_browser_${key}`,
              description: value.description,
              parameters: value.parameters,
            },
          }),
        );
      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        ...conversationHistory,
        { role: 'user', content: userMessage },
      ];
      const initialResponse = await this.openai.chat.completions.create({
        model: 'gpt-4-0125-preview',
        messages,
        tools,
        tool_choice: 'auto',
      });
      const initialMessage = initialResponse.choices[0].message;
      const toolCalls = this.extractToolCalls(initialMessage);
      if (!toolCalls || toolCalls.length === 0) {
        return {
          content: initialMessage.content ?? '',
          toolCalls: [],
          toolResults: [],
        };
      }
      // Tool results must match OpenAI's ChatCompletionFunctionMessageParam
      const toolResults: OpenAI.Chat.Completions.ChatCompletionFunctionMessageParam[] =
        await Promise.all(
          toolCalls.map(async (toolCall) => {
            const result = await this.executeToolCall(toolCall);
            return {
              role: 'function',
              name: toolCall.function.name,
              tool_call_id: toolCall.id,
              content: JSON.stringify(result as Record<string, unknown>),
            };
          }),
        );
      const followUpMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
        [
          ...messages,
          initialMessage as OpenAI.Chat.Completions.ChatCompletionMessageParam,
          ...toolResults,
        ];
      const followUpResponse = await this.openai.chat.completions.create({
        model: 'gpt-4-0125-preview',
        messages: followUpMessages,
      });
      return {
        content: followUpResponse.choices[0].message.content ?? '',
        toolCalls,
        toolResults,
      };
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error in MCP integration: ${error.message}`);
        throw error;
      }
      throw new Error('Unknown error in MCP integration');
    }
  }
}
