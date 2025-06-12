import {
  Controller,
  Post,
  Get,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { OllamaService } from './ollama.service.js';

interface GenerateRequestDto {
  prompt: string;
  model?: string;
}

interface ChatRequestDto {
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  model?: string;
}

@Controller('ai')
export class OllamaController {
  constructor(private readonly ollamaService: OllamaService) {}

  @Get('health')
  async checkHealth() {
    const isHealthy = await this.ollamaService.checkOllamaHealth();

    if (!isHealthy) {
      throw new HttpException(
        'Ollama no está disponible. Asegúrate de que esté ejecutándose.',
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }

    return {
      success: true,
      message: 'Ollama está funcionando correctamente',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('generate')
  async generate(@Body() generateRequest: GenerateRequestDto) {
    if (!generateRequest.prompt) {
      throw new HttpException('El prompt es requerido', HttpStatus.BAD_REQUEST);
    }

    try {
      const response = await this.ollamaService.generateResponse(
        generateRequest.prompt,
        generateRequest.model,
      );

      return {
        success: true,
        data: {
          response: response,
          model: generateRequest.model || 'default',
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('chat')
  async chat(@Body() chatRequest: ChatRequestDto) {
    if (!chatRequest.messages || chatRequest.messages.length === 0) {
      throw new HttpException(
        'Los mensajes son requeridos',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const response = await this.ollamaService.chatCompletion(
        chatRequest.messages,
        chatRequest.model,
      );

      return {
        success: true,
        data: {
          response: response,
          model: chatRequest.model || 'default',
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('warmup')
  async warmupModel(@Body() body: { model?: string }) {
    const model = body.model || 'phi3:mini';
    
    try {
      await this.ollamaService.warmupModel(model);
      return {
        success: true,
        message: `Modelo ${model} precargado exitosamente`,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('models')
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
    } catch (error) {
      throw error;
    }
  }
}
