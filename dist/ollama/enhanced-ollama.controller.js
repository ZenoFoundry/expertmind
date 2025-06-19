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
import { Controller, Post, Get, Body, HttpException, HttpStatus, } from '@nestjs/common';
import { EnhancedOllamaService } from './enhanced-ollama.service.js';
let EnhancedOllamaController = class EnhancedOllamaController {
    enhancedOllamaService;
    constructor(enhancedOllamaService) {
        this.enhancedOllamaService = enhancedOllamaService;
    }
    async generateWithMCP(request) {
        if (!request.prompt) {
            throw new HttpException('El prompt es requerido', HttpStatus.BAD_REQUEST);
        }
        try {
            const result = await this.enhancedOllamaService.generateWithMCP(request.prompt, request.model, request.autoExecuteTools ?? true);
            return {
                success: true,
                data: {
                    response: result.response,
                    toolsUsed: result.toolsUsed,
                    toolResults: result.toolResults,
                    model: request.model || 'default',
                    timestamp: new Date().toISOString(),
                },
            };
        }
        catch (error) {
            throw error;
        }
    }
    async chatWithMCP(request) {
        if (!request.messages || request.messages.length === 0) {
            throw new HttpException('Los mensajes son requeridos', HttpStatus.BAD_REQUEST);
        }
        try {
            const result = await this.enhancedOllamaService.chatWithMCP(request.messages, request.model, request.autoExecuteTools ?? true);
            return {
                success: true,
                data: {
                    response: result.response,
                    toolsUsed: result.toolsUsed,
                    toolResults: result.toolResults,
                    model: request.model || 'default',
                    timestamp: new Date().toISOString(),
                },
            };
        }
        catch (error) {
            throw error;
        }
    }
    async executeTool(request) {
        if (!request.toolName) {
            throw new HttpException('El nombre de la herramienta es requerido', HttpStatus.BAD_REQUEST);
        }
        try {
            const result = await this.enhancedOllamaService.executeMCPTool(request.toolName, request.args || {});
            return {
                success: true,
                data: {
                    tool: request.toolName,
                    result: result,
                    timestamp: new Date().toISOString(),
                },
            };
        }
        catch (error) {
            throw new HttpException(`Error ejecutando herramienta ${request.toolName}: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getAvailableTools() {
        try {
            const tools = this.enhancedOllamaService.getAvailableMCPTools();
            return {
                success: true,
                data: {
                    tools: tools,
                    count: tools.length,
                    timestamp: new Date().toISOString(),
                },
            };
        }
        catch (error) {
            throw new HttpException(`Error obteniendo herramientas: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async generateSimple(request) {
        if (!request.prompt) {
            throw new HttpException('El prompt es requerido', HttpStatus.BAD_REQUEST);
        }
        try {
            const response = await this.enhancedOllamaService.generateResponse(request.prompt, request.model);
            return {
                success: true,
                data: {
                    response: response,
                    model: request.model || 'default',
                    timestamp: new Date().toISOString(),
                },
            };
        }
        catch (error) {
            throw error;
        }
    }
};
__decorate([
    Post('generate'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EnhancedOllamaController.prototype, "generateWithMCP", null);
__decorate([
    Post('chat'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EnhancedOllamaController.prototype, "chatWithMCP", null);
__decorate([
    Post('tools/execute'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EnhancedOllamaController.prototype, "executeTool", null);
__decorate([
    Get('tools'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EnhancedOllamaController.prototype, "getAvailableTools", null);
__decorate([
    Post('generate/simple'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EnhancedOllamaController.prototype, "generateSimple", null);
EnhancedOllamaController = __decorate([
    Controller('ai/enhanced'),
    __metadata("design:paramtypes", [EnhancedOllamaService])
], EnhancedOllamaController);
export { EnhancedOllamaController };
//# sourceMappingURL=enhanced-ollama.controller.js.map