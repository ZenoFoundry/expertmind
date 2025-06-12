import { GitHubConfig, MCPToolResult } from './interfaces/mcp.interfaces.js';
export declare class GitHubMCPServer {
    private octokit;
    constructor(config: GitHubConfig);
    getRepositoryInfo(owner: string, repo: string): Promise<MCPToolResult>;
    listRepositoryFiles(owner: string, repo: string, path?: string): Promise<MCPToolResult>;
    getFileContent(owner: string, repo: string, path: string): Promise<MCPToolResult>;
    listIssues(owner: string, repo: string, state?: string): Promise<MCPToolResult>;
    listCommits(owner: string, repo: string, limit?: number): Promise<MCPToolResult>;
}
