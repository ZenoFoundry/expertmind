import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MCPToolResult } from './interfaces/mcp.interfaces.js';
export declare class MCPClientService implements OnModuleInit {
    private configService;
    private githubServer;
    private connected;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    private initializeMCPClient;
    callTool(toolName: string, args: any): Promise<MCPToolResult>;
    listAvailableTools(): Promise<{
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
    }>;
    isConnected(): boolean;
}
