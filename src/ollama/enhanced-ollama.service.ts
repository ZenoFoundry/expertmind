import { Injectable } from '@nestjs/common';
import { OllamaService } from './ollama.service.js';
import { MCPClientService } from '../mcp/mcp-client.service.js';

@Injectable()
export class EnhancedOllamaService {
  constructor(
    private ollamaService: OllamaService,
    private mcpClient: MCPClientService,
  ) {}

  async generateWithGitHubContext(
    prompt: string,
    githubContext?: {
      owner: string;
      repo: string;
      includeFiles?: boolean;
      includeIssues?: boolean;
      includeCommits?: boolean;
    },
    model?: string
  ): Promise<string> {
    let enhancedPrompt = prompt;

    if (githubContext && this.mcpClient.isConnected()) {
      try {
        // Obtener información del repositorio
        const repoInfo = await this.mcpClient.callTool('get_repository_info', {
          owner: githubContext.owner,
          repo: githubContext.repo,
        });

        enhancedPrompt += `\n\n=== CONTEXTO DEL REPOSITORIO ${githubContext.owner}/${githubContext.repo} ===\n`;
        enhancedPrompt += `Información del repositorio:\n${repoInfo.content[0].text}\n`;

        // Incluir estructura de archivos si se solicita
        if (githubContext.includeFiles) {
          const files = await this.mcpClient.callTool('list_repository_files', {
            owner: githubContext.owner,
            repo: githubContext.repo,
          });
          enhancedPrompt += `\nEstructura de archivos:\n${files.content[0].text}\n`;
        }

        // Incluir issues si se solicita
        if (githubContext.includeIssues) {
          const issues = await this.mcpClient.callTool('list_issues', {
            owner: githubContext.owner,
            repo: githubContext.repo,
          });
          enhancedPrompt += `\nIssues del repositorio:\n${issues.content[0].text}\n`;
        }

        // Incluir commits recientes si se solicita
        if (githubContext.includeCommits) {
          const commits = await this.mcpClient.callTool('list_commits', {
            owner: githubContext.owner,
            repo: githubContext.repo,
            limit: 5,
          });
          enhancedPrompt += `\nCommits recientes:\n${commits.content[0].text}\n`;
        }

        enhancedPrompt += `\n=== FIN DEL CONTEXTO ===\n`;
      } catch (error) {
        console.warn('⚠️  Error al obtener contexto de GitHub:', error.message);
        enhancedPrompt += `\n\n[Nota: No se pudo obtener información del repositorio ${githubContext.owner}/${githubContext.repo}]\n`;
      }
    }

    return await this.ollamaService.generateResponse(enhancedPrompt, model);
  }

  async analyzeCodeFile(
    owner: string,
    repo: string,
    filePath: string,
    analysisPrompt: string,
    model?: string,
  ): Promise<string> {
    if (!this.mcpClient.isConnected()) {
      throw new Error('MCP Client no está conectado');
    }

    try {
      // Obtener el contenido del archivo
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
    } catch (error) {
      throw new Error(`Error al analizar archivo: ${error.message}`);
    }
  }

  async compareWithRepository(
    prompt: string,
    repo1: { owner: string; repo: string },
    repo2: { owner: string; repo: string },
    model?: string
  ): Promise<string> {
    if (!this.mcpClient.isConnected()) {
      throw new Error('MCP Client no está conectado');
    }

    try {
      // Obtener información de ambos repositorios
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
    } catch (error) {
      throw new Error(`Error al comparar repositorios: ${error.message}`);
    }
  }
}
