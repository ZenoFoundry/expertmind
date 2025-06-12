export interface GitHubConfig {
    token: string;
    owner?: string;
    repo?: string;
}
export interface MCPTool {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: Record<string, any>;
        required: string[];
    };
}
export interface MCPToolResult {
    content: Array<{
        type: string;
        text: string;
    }>;
}
export interface GitHubAnalysisRequest {
    prompt: string;
    owner: string;
    repo: string;
    includeFiles?: boolean;
    includeIssues?: boolean;
    includeCommits?: boolean;
    model?: string;
}
export interface CodeAnalysisRequest {
    owner: string;
    repo: string;
    filePath: string;
    analysisPrompt: string;
    model?: string;
}
