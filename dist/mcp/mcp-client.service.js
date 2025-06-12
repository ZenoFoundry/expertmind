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
import { ConfigService } from '@nestjs/config';
import { GitHubMCPServer } from './github-mcp-server.js';
let MCPClientService = class MCPClientService {
    configService;
    githubServer;
    connected = false;
    constructor(configService) {
        this.configService = configService;
    }
    async onModuleInit() {
        await this.initializeMCPClient();
    }
    async initializeMCPClient() {
        try {
            const githubToken = this.configService.get('GITHUB_TOKEN');
            if (!githubToken) {
                console.warn('⚠️  GITHUB_TOKEN no configurado. Las funciones de GitHub no estarán disponibles.');
                return;
            }
            this.githubServer = new GitHubMCPServer({
                token: githubToken,
            });
            this.connected = true;
            console.log('✅ Cliente MCP conectado exitosamente');
        }
        catch (error) {
            console.error('❌ Error al conectar cliente MCP:', error);
        }
    }
    async callTool(toolName, args) {
        if (!this.connected) {
            throw new Error('Cliente MCP no está conectado');
        }
        try {
            switch (toolName) {
                case 'get_repository_info':
                    return await this.githubServer.getRepositoryInfo(args.owner, args.repo);
                case 'list_repository_files':
                    return await this.githubServer.listRepositoryFiles(args.owner, args.repo, args.path);
                case 'get_file_content':
                    return await this.githubServer.getFileContent(args.owner, args.repo, args.path);
                case 'list_issues':
                    return await this.githubServer.listIssues(args.owner, args.repo, args.state);
                case 'list_commits':
                    return await this.githubServer.listCommits(args.owner, args.repo, args.limit);
                default:
                    throw new Error(`Herramienta desconocida: ${toolName}`);
            }
        }
        catch (error) {
            throw new Error(`Error al ejecutar herramienta MCP: ${error.message}`);
        }
    }
    async listAvailableTools() {
        return {
            tools: [
                {
                    name: 'get_repository_info',
                    description: 'Obtiene información de un repositorio de GitHub',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            owner: {
                                type: 'string',
                                description: 'Propietario del repositorio',
                            },
                            repo: { type: 'string', description: 'Nombre del repositorio' },
                        },
                        required: ['owner', 'repo'],
                    },
                },
                {
                    name: 'list_repository_files',
                    description: 'Lista los archivos de un repositorio',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            owner: { type: 'string' },
                            repo: { type: 'string' },
                            path: {
                                type: 'string',
                                description: 'Ruta opcional',
                                default: '',
                            },
                        },
                        required: ['owner', 'repo'],
                    },
                },
                {
                    name: 'get_file_content',
                    description: 'Obtiene el contenido de un archivo',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            owner: { type: 'string' },
                            repo: { type: 'string' },
                            path: { type: 'string', description: 'Ruta del archivo' },
                        },
                        required: ['owner', 'repo', 'path'],
                    },
                },
                {
                    name: 'list_issues',
                    description: 'Lista los issues de un repositorio',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            owner: { type: 'string' },
                            repo: { type: 'string' },
                            state: {
                                type: 'string',
                                enum: ['open', 'closed', 'all'],
                                default: 'open',
                            },
                        },
                        required: ['owner', 'repo'],
                    },
                },
                {
                    name: 'list_commits',
                    description: 'Lista los commits recientes de un repositorio',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            owner: { type: 'string' },
                            repo: { type: 'string' },
                            limit: {
                                type: 'number',
                                description: 'Número de commits',
                                default: 10,
                            },
                        },
                        required: ['owner', 'repo'],
                    },
                },
            ],
        };
    }
    isConnected() {
        return this.connected;
    }
};
MCPClientService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ConfigService])
], MCPClientService);
export { MCPClientService };
//# sourceMappingURL=mcp-client.service.js.map