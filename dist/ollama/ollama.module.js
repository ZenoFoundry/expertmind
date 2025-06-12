var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OllamaController } from './ollama.controller.js';
import { EnhancedOllamaController } from './enhanced-ollama.controller.js';
import { OllamaService } from './ollama.service.js';
import { EnhancedOllamaService } from './enhanced-ollama.service.js';
import { MCPModule } from '../mcp/mcp.module.js';
let OllamaModule = class OllamaModule {
};
OllamaModule = __decorate([
    Module({
        imports: [ConfigModule, MCPModule],
        controllers: [OllamaController, EnhancedOllamaController],
        providers: [OllamaService, EnhancedOllamaService],
        exports: [OllamaService, EnhancedOllamaService],
    })
], OllamaModule);
export { OllamaModule };
//# sourceMappingURL=ollama.module.js.map