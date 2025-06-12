var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { OllamaService } from './ollama.service.js';
import { MCPClientService } from '../mcp/mcp-client.service.js';
let EnhancedOllamaService = class EnhancedOllamaService {
    ollamaService;
    mcpClient;
    constructor(ollamaService, mcpClient) {
        this.ollamaService = ollamaService;
        this.mcpClient = mcpClient;
    }
    async generateWithGitHubContext(prompt, githubContext, model) {
        let enhancedPrompt = prompt;
        if (githubContext && this.mcpClient.isConnected()) {
            try {
                const repoInfo = await this.mcpClient.callTool('get_repository_info', {
                    owner: githubContext.owner,
                    repo: githubContext.repo,
                });
                enhancedPrompt += `\n\n=== CONTEXTO DEL REPOSITORIO ${githubContext.owner}/${githubContext.repo} ===\n`;
                enhancedPrompt += `Información del repositorio:\n${repoInfo.content[0].text}\n`;
                if (githubContext.includeFiles) {
                    const files = await this.mcpClient.callTool('list_repository_files', {
                        owner: githubContext.owner,
                        repo: githubContext.repo,
                    });
                    enhancedPrompt += `\nEstructura de archivos:\n${files.content[0].text}\n`;
                }
                if (githubContext.includeIssues) {
                    const issues = await this.mcpClient.callTool('list_issues', {
                        owner: githubContext.owner,
                        repo: githubContext.repo,
                    });
                    enhancedPrompt += `\nIssues del repositorio:\n${issues.content[0].text}\n`;
                }
                if (githubContext.includeCommits) {
                    const commits = await this.mcpClient.callTool('list_commits', {
                        owner: githubContext.owner,
                        repo: githubContext.repo,
                        limit: 5,
                    });
                    enhancedPrompt += `\nCommits recientes:\n${commits.content[0].text}\n`;
                }
                enhancedPrompt += `\n=== FIN DEL CONTEXTO ===\n`;
            }
            catch (error) {
                console.warn('⚠️  Error al obtener contexto de GitHub:', error.message);
                enhancedPrompt += `\n\n[Nota: No se pudo obtener información del repositorio ${githubContext.owner}/${githubContext.repo}]\n`;
            }
        }
        return await this.ollamaService.generateResponse(enhancedPrompt, model);
    }
    async analyzeCodeFile(owner, repo, filePath, analysisPrompt, model) {
        if (!this.mcpClient.isConnected()) {
            throw new Error('MCP Client no está conectado');
        }
        try {
            const fileContent = await this.mcpClient.callTool('get_file_content', {
                owner,
                repo,
                path: filePath,
            });
            const prompt = `${analysisPrompt}

=== ARCHIVO A ANALIZAR ===
Archivo: ${filePath}
Repositorio: ${owner}/${repo}

Contenido:
\`\`\`
${fileContent.content[0].text}
\`\`\`

=== INSTRUCCIONES ===
Analiza el código anterior y proporciona una respuesta detallada.`;
            return await this.ollamaService.generateResponse(prompt, model);
        }
        catch (error) {
            throw new Error(`Error al analizar archivo: ${error.message}`);
        }
    }
    async compareWithRepository(prompt, repo1, repo2, model) {
        if (!this.mcpClient.isConnected()) {
            throw new Error('MCP Client no está conectado');
        }
        try {
            const [repoInfo1, repoInfo2] = await Promise.all([
                this.mcpClient.callTool('get_repository_info', repo1),
                this.mcpClient.callTool('get_repository_info', repo2),
            ]);
            const enhancedPrompt = `${prompt}

=== REPOSITORIO 1: ${repo1.owner}/${repo1.repo} ===
${repoInfo1.content[0].text}

=== REPOSITORIO 2: ${repo2.owner}/${repo2.repo} ===
${repoInfo2.content[0].text}

=== INSTRUCCIONES ===
Compara ambos repositorios basándote en la información proporcionada.`;
            return await this.ollamaService.generateResponse(enhancedPrompt, model);
        }
        catch (error) {
            throw new Error(`Error al comparar repositorios: ${error.message}`);
        }
    }
};
EnhancedOllamaService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [OllamaService,
        MCPClientService])
], EnhancedOllamaService);
export { EnhancedOllamaService };
//# sourceMappingURL=enhanced-ollama.service.js.map