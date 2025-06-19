import { ConfigService } from '@nestjs/config';
import { MCPService } from '../mcp/mcp.service.js';
export declare class EnhancedOllamaService {
    private configService;
    private mcpService;
    private readonly logger;
    private readonly ollamaUrl;
    private readonly defaultModel;
    constructor(configService: ConfigService, mcpService: MCPService);
    generateWithMCP(prompt: string, model?: string, autoExecuteTools?: boolean): Promise<{
        response: string;
        toolsUsed: string[];
        toolResults: any[];
    }>;
    private generateOllamaResponse;
    chatWithMCP(messages: any[], model?: string, autoExecuteTools?: boolean): Promise<{
        response: string;
        toolsUsed: string[];
        toolResults: any[];
    }>;
    executeMCPTool(toolName: string, args: any): Promise<any>;
    getAvailableMCPTools(): import("../mcp/mcp.service.js").MCPTool[];
    generateResponse(prompt: string, model?: string): Promise<string>;
}
