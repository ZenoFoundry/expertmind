import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OllamaController } from './ollama.controller.js';
import { EnhancedOllamaController } from './enhanced-ollama.controller.js';
import { OllamaService } from './ollama.service.js';
import { EnhancedOllamaService } from './enhanced-ollama.service.js';
import { MCPModule } from '../mcp/mcp.module.js';

@Module({
  imports: [ConfigModule, MCPModule],
  controllers: [OllamaController, EnhancedOllamaController],
  providers: [OllamaService, EnhancedOllamaService],
  exports: [OllamaService, EnhancedOllamaService],
})
export class OllamaModule {}
