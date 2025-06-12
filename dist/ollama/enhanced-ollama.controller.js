var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Post, Get, Body, Param, HttpException, HttpStatus, } from '@nestjs/common';
import { EnhancedOllamaService } from './enhanced-ollama.service.js';
import { MCPClientService } from '../mcp/mcp-client.service.js';
let EnhancedOllamaController = class EnhancedOllamaController {
    enhancedOllamaService;
    mcpClient;
    constructor(enhancedOllamaService, mcpClient) {
        this.enhancedOllamaService = enhancedOllamaService;
        this.mcpClient = mcpClient;
    }
    async analyzeGitHub(request) {
        if (!request.prompt || !request.owner || !request.repo) {
            throw new HttpException('prompt, owner y repo son campos requeridos', HttpStatus.BAD_REQUEST);
        }
        try {
            const response = await this.enhancedOllamaService.generateWithGitHubContext(request.prompt, {
                owner: request.owner,
                repo: request.repo,
                includeFiles: request.includeFiles || false,
                includeIssues: request.includeIssues || false,
                includeCommits: request.includeCommits || false,
            }, request.model);
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
        }
        catch (error) {
            throw new HttpException(`Error al analizar repositorio: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async analyzeCode(request) {
        if (!request.owner ||
            !request.repo ||
            !request.filePath ||
            !request.analysisPrompt) {
            throw new HttpException('owner, repo, filePath y analysisPrompt son campos requeridos', HttpStatus.BAD_REQUEST);
        }
        try {
            const response = await this.enhancedOllamaService.analyzeCodeFile(request.owner, request.repo, request.filePath, request.analysisPrompt, request.model);
            return {
                success: true,
                data: {
                    response: response,
                    file: `${request.owner}/${request.repo}/${request.filePath}`,
                    timestamp: new Date().toISOString(),
                },
            };
        }
        catch (error) {
            throw new HttpException(`Error al analizar código: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async compareRepositories(request) {
        if (!request.prompt || !request.repo1 || !request.repo2) {
            throw new HttpException('prompt, repo1 y repo2 son campos requeridos', HttpStatus.BAD_REQUEST);
        }
        try {
            const response = await this.enhancedOllamaService.compareWithRepository(request.prompt, request.repo1, request.repo2, request.model);
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
        }
        catch (error) {
            throw new HttpException(`Error al comparar repositorios: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
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
        }
        catch (error) {
            throw new HttpException(`Error al obtener herramientas: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async callGitHubTool(toolName, args) {
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
        }
        catch (error) {
            throw new HttpException(`Error al ejecutar herramienta ${toolName}: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
__decorate([
    Post('analyze-github'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EnhancedOllamaController.prototype, "analyzeGitHub", null);
__decorate([
    Post('analyze-code'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EnhancedOllamaController.prototype, "analyzeCode", null);
__decorate([
    Post('compare-repositories'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EnhancedOllamaController.prototype, "compareRepositories", null);
__decorate([
    Get('github-tools'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EnhancedOllamaController.prototype, "getGitHubTools", null);
__decorate([
    Post('github-tool/:toolName'),
    __param(0, Param('toolName')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EnhancedOllamaController.prototype, "callGitHubTool", null);
EnhancedOllamaController = __decorate([
    Controller('ai'),
    __metadata("design:paramtypes", [EnhancedOllamaService,
        MCPClientService])
], EnhancedOllamaController);
export { EnhancedOllamaController };
//# sourceMappingURL=enhanced-ollama.controller.js.map