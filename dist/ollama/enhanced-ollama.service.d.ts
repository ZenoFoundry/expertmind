import { OllamaService } from './ollama.service.js';
import { MCPClientService } from '../mcp/mcp-client.service.js';
export declare class EnhancedOllamaService {
    private ollamaService;
    private mcpClient;
    constructor(ollamaService: OllamaService, mcpClient: MCPClientService);
    generateWithGitHubContext(prompt: string, githubContext?: {
        owner: string;
        repo: string;
        includeFiles?: boolean;
        includeIssues?: boolean;
        includeCommits?: boolean;
    }, model?: string): Promise<string>;
    analyzeCodeFile(owner: string, repo: string, filePath: string, analysisPrompt: string, model?: string): Promise<string>;
    compareWithRepository(prompt: string, repo1: {
        owner: string;
        repo: string;
    }, repo2: {
        owner: string;
        repo: string;
    }, model?: string): Promise<string>;
}
