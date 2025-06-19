import { EnhancedOllamaService } from './enhanced-ollama.service.js';
interface GenerateWithMCPRequestDto {
    prompt: string;
    model?: string;
    autoExecuteTools?: boolean;
}
interface ChatWithMCPRequestDto {
    messages: Array<{
        role: 'user' | 'assistant' | 'system';
        content: string;
    }>;
    model?: string;
    autoExecuteTools?: boolean;
}
interface ExecuteToolRequestDto {
    toolName: string;
    args: any;
}
export declare class EnhancedOllamaController {
    private enhancedOllamaService;
    constructor(enhancedOllamaService: EnhancedOllamaService);
    generateWithMCP(request: GenerateWithMCPRequestDto): Promise<{
        success: boolean;
        data: {
            response: string;
            toolsUsed: string[];
            toolResults: any[];
            model: string;
            timestamp: string;
        };
    }>;
    chatWithMCP(request: ChatWithMCPRequestDto): Promise<{
        success: boolean;
        data: {
            response: string;
            toolsUsed: string[];
            toolResults: any[];
            model: string;
            timestamp: string;
        };
    }>;
    executeTool(request: ExecuteToolRequestDto): Promise<{
        success: boolean;
        data: {
            tool: string;
            result: any;
            timestamp: string;
        };
    }>;
    getAvailableTools(): Promise<{
        success: boolean;
        data: {
            tools: import("../mcp/mcp.service.js").MCPTool[];
            count: number;
            timestamp: string;
        };
    }>;
    generateSimple(request: {
        prompt: string;
        model?: string;
    }): Promise<{
        success: boolean;
        data: {
            response: string;
            model: string;
            timestamp: string;
        };
    }>;
}
export {};
