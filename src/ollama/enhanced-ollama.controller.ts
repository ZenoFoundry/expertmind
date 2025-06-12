import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { EnhancedOllamaService } from './enhanced-ollama.service.js';
import { MCPClientService } from '../mcp/mcp-client.service.js';
import {
  GitHubAnalysisRequest,
  CodeAnalysisRequest,
} from '../mcp/interfaces/mcp.interfaces.js';

interface CompareRepositoriesRequest {
  prompt: string;
  repo1: { owner: string; repo: string };
  repo2: { owner: string; repo: string };
  model?: string;
}

@Controller('ai')
export class EnhancedOllamaController {
  constructor(
    private enhancedOllamaService: EnhancedOllamaService,
    private mcpClient: MCPClientService,
  ) {}

  @Post('analyze-github')
  async analyzeGitHub(@Body() request: GitHubAnalysisRequest) {
    if (!request.prompt || !request.owner || !request.repo) {
      throw new HttpException(
        'prompt, owner y repo son campos requeridos',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const response =
        await this.enhancedOllamaService.generateWithGitHubContext(
          request.prompt,
          {
            owner: request.owner,
            repo: request.repo,
            includeFiles: request.includeFiles || false,
            includeIssues: request.includeIssues || false,
            includeCommits: request.includeCommits || false,
          },
          request.model,
        );

      return {
        success: true,
        data: {
          response: response,
          repository: `${request.owner}/${request.repo}`,
          context_included: {
            files: request.includeFiles || false,
            issues: request.includeIssues || false,
            commits: request.includeCommits || false,
          },
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      throw new HttpException(
        `Error al analizar repositorio: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('analyze-code')
  async analyzeCode(@Body() request: CodeAnalysisRequest) {
    if (
      !request.owner ||
      !request.repo ||
      !request.filePath ||
      !request.analysisPrompt
    ) {
      throw new HttpException(
        'owner, repo, filePath y analysisPrompt son campos requeridos',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const response = await this.enhancedOllamaService.analyzeCodeFile(
        request.owner,
        request.repo,
        request.filePath,
        request.analysisPrompt,
        request.model,
      );

      return {
        success: true,
        data: {
          response: response,
          file: `${request.owner}/${request.repo}/${request.filePath}`,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      throw new HttpException(
        `Error al analizar código: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('compare-repositories')
  async compareRepositories(@Body() request: CompareRepositoriesRequest) {
    if (!request.prompt || !request.repo1 || !request.repo2) {
      throw new HttpException(
        'prompt, repo1 y repo2 son campos requeridos',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const response = await this.enhancedOllamaService.compareWithRepository(
        request.prompt,
        request.repo1,
        request.repo2,
        request.model,
      );

      return {
        success: true,
        data: {
          response: response,
          repositories: [
            `${request.repo1.owner}/${request.repo1.repo}`,
            `${request.repo2.owner}/${request.repo2.repo}`,
          ],
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      throw new HttpException(
        `Error al comparar repositorios: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('github-tools')
  async getGitHubTools() {
    try {
      const tools = await this.mcpClient.listAvailableTools();
      return {
        success: true,
        data: {
          tools: tools.tools,
          mcp_connected: this.mcpClient.isConnected(),
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      throw new HttpException(
        `Error al obtener herramientas: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('github-tool/:toolName')
  async callGitHubTool(@Param('toolName') toolName: string, @Body() args: any) {
    try {
      const result = await this.mcpClient.callTool(toolName, args);
      return {
        success: true,
        data: {
          tool: toolName,
          result: result,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      throw new HttpException(
        `Error al ejecutar herramienta ${toolName}: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
