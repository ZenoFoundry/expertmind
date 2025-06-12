import { EnhancedOllamaService } from './enhanced-ollama.service.js';
import { MCPClientService } from '../mcp/mcp-client.service.js';
import { GitHubAnalysisRequest, CodeAnalysisRequest } from '../mcp/interfaces/mcp.interfaces.js';
interface CompareRepositoriesRequest {
    prompt: string;
    repo1: {
        owner: string;
        repo: string;
    };
    repo2: {
        owner: string;
        repo: string;
    };
    model?: string;
}
export declare class EnhancedOllamaController {
    private enhancedOllamaService;
    private mcpClient;
    constructor(enhancedOllamaService: EnhancedOllamaService, mcpClient: MCPClientService);
    analyzeGitHub(request: GitHubAnalysisRequest): Promise<{
        success: boolean;
        data: {
            response: string;
            repository: string;
            context_included: {
                files: boolean;
                issues: boolean;
                commits: boolean;
            };
            timestamp: string;
        };
    }>;
    analyzeCode(request: CodeAnalysisRequest): Promise<{
        success: boolean;
        data: {
            response: string;
            file: string;
            timestamp: string;
        };
    }>;
    compareRepositories(request: CompareRepositoriesRequest): Promise<{
        success: boolean;
        data: {
            response: string;
            repositories: string[];
            timestamp: string;
        };
    }>;
    getGitHubTools(): Promise<{
        success: boolean;
        data: {
            tools: ({
                name: string;
                description: string;
                inputSchema: {
                    type: string;
                    properties: {
                        owner: {
                            type: string;
                            description: string;
                        };
                        repo: {
                            type: string;
                            description: string;
                        };
                        path?: undefined;
                        state?: undefined;
                        limit?: undefined;
                    };
                    required: string[];
                };
            } | {
                name: string;
                description: string;
                inputSchema: {
                    type: string;
                    properties: {
                        owner: {
                            type: string;
                            description?: undefined;
                        };
                        repo: {
                            type: string;
                            description?: undefined;
                        };
                        path: {
                            type: string;
                            description: string;
                            default: string;
                        };
                        state?: undefined;
                        limit?: undefined;
                    };
                    required: string[];
                };
            } | {
                name: string;
                description: string;
                inputSchema: {
                    type: string;
                    properties: {
                        owner: {
                            type: string;
                            description?: undefined;
                        };
                        repo: {
                            type: string;
                            description?: undefined;
                        };
                        path: {
                            type: string;
                            description: string;
                            default?: undefined;
                        };
                        state?: undefined;
                        limit?: undefined;
                    };
                    required: string[];
                };
            } | {
                name: string;
                description: string;
                inputSchema: {
                    type: string;
                    properties: {
                        owner: {
                            type: string;
                            description?: undefined;
                        };
                        repo: {
                            type: string;
                            description?: undefined;
                        };
                        state: {
                            type: string;
                            enum: string[];
                            default: string;
                        };
                        path?: undefined;
                        limit?: undefined;
                    };
                    required: string[];
                };
            } | {
                name: string;
                description: string;
                inputSchema: {
                    type: string;
                    properties: {
                        owner: {
                            type: string;
                            description?: undefined;
                        };
                        repo: {
                            type: string;
                            description?: undefined;
                        };
                        limit: {
                            type: string;
                            description: string;
                            default: number;
                        };
                        path?: undefined;
                        state?: undefined;
                    };
                    required: string[];
                };
            })[];
            mcp_connected: boolean;
            timestamp: string;
        };
    }>;
    callGitHubTool(toolName: string, args: any): Promise<{
        success: boolean;
        data: {
            tool: string;
            result: import("../mcp/interfaces/mcp.interfaces.js").MCPToolResult;
            timestamp: string;
        };
    }>;
}
export {};
