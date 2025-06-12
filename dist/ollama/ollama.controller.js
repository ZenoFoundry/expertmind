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
import { OllamaService } from './ollama.service.js';
let OllamaController = class OllamaController {
    ollamaService;
    constructor(ollamaService) {
        this.ollamaService = ollamaService;
    }
    async checkHealth() {
        const isHealthy = await this.ollamaService.checkOllamaHealth();
        if (!isHealthy) {
            throw new HttpException('Ollama no está disponible. Asegúrate de que esté ejecutándose.', HttpStatus.SERVICE_UNAVAILABLE);
        }
        return {
            success: true,
            message: 'Ollama está funcionando correctamente',
            timestamp: new Date().toISOString(),
        };
    }
    async generate(generateRequest) {
        if (!generateRequest.prompt) {
            throw new HttpException('El prompt es requerido', HttpStatus.BAD_REQUEST);
        }
        try {
            const response = await this.ollamaService.generateResponse(generateRequest.prompt, generateRequest.model);
            return {
                success: true,
                data: {
                    response: response,
                    model: generateRequest.model || 'default',
                    timestamp: new Date().toISOString(),
                },
            };
        }
        catch (error) {
            throw error;
        }
    }
    async chat(chatRequest) {
        if (!chatRequest.messages || chatRequest.messages.length === 0) {
            throw new HttpException('Los mensajes son requeridos', HttpStatus.BAD_REQUEST);
        }
        try {
            const response = await this.ollamaService.chatCompletion(chatRequest.messages, chatRequest.model);
            return {
                success: true,
                data: {
                    response: response,
                    model: chatRequest.model || 'default',
                    timestamp: new Date().toISOString(),
                },
            };
        }
        catch (error) {
            throw error;
        }
    }
    async warmupModel(body) {
        const model = body.model || 'phi3:mini';
        try {
            await this.ollamaService.warmupModel(model);
            return {
                success: true,
                message: `Modelo ${model} precargado exitosamente`,
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            throw error;
        }
    }
    async getModels() {
        try {
            const models = await this.ollamaService.getAvailableModels();
            return {
                success: true,
                data: {
                    models: models,
                    count: models.length,
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
    Get('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OllamaController.prototype, "checkHealth", null);
__decorate([
    Post('generate'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OllamaController.prototype, "generate", null);
__decorate([
    Post('chat'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OllamaController.prototype, "chat", null);
__decorate([
    Post('warmup'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OllamaController.prototype, "warmupModel", null);
__decorate([
    Get('models'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OllamaController.prototype, "getModels", null);
OllamaController = __decorate([
    Controller('ai'),
    __metadata("design:paramtypes", [OllamaService])
], OllamaController);
export { OllamaController };
//# sourceMappingURL=ollama.controller.js.map