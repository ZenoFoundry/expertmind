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

interface GenerateWithMCPRequestDto {
  prompt: string;
  model?: string;
  autoExecuteTools?: boolean;
}

interface ChatWithMCPRequestDto {
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  model?: string;
  autoExecuteTools?: boolean;
}

interface ExecuteToolRequestDto {
  toolName: string;
  args: any;
}

@Controller('ai/enhanced')
export class EnhancedOllamaController {
  constructor(
    private enhancedOllamaService: EnhancedOllamaService,
  ) {}

  /**
   * Endpoint principal: Genera respuesta con integración MCP automática
   * Este es el endpoint que reemplaza o complementa tu /api/generate original
   */
  @Post('generate')
  async generateWithMCP(@Body() request: GenerateWithMCPRequestDto) {
    if (!request.prompt) {
      throw new HttpException('El prompt es requerido', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.enhancedOllamaService.generateWithMCP(
        request.prompt,
        request.model,
        request.autoExecuteTools ?? true
      );

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
    } catch (error) {
      throw error;
    }
  }

  /**
   * Chat con integración MCP
   */
  @Post('chat')
  async chatWithMCP(@Body() request: ChatWithMCPRequestDto) {
    if (!request.messages || request.messages.length === 0) {
      throw new HttpException(
        'Los mensajes son requeridos',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const result = await this.enhancedOllamaService.chatWithMCP(
        request.messages,
        request.model,
        request.autoExecuteTools ?? true
      );

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
    } catch (error) {
      throw error;
    }
  }

  /**
   * Ejecutar herramienta MCP específica manualmente
   */
  @Post('tools/execute')
  async executeTool(@Body() request: ExecuteToolRequestDto) {
    if (!request.toolName) {
      throw new HttpException(
        'El nombre de la herramienta es requerido',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const result = await this.enhancedOllamaService.executeMCPTool(
        request.toolName,
        request.args || {},
      );

      return {
        success: true,
        data: {
          tool: request.toolName,
          result: result,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      throw new HttpException(
        `Error ejecutando herramienta ${request.toolName}: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Listar herramientas MCP disponibles
   */
  @Get('tools')
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
    } catch (error) {
      throw new HttpException(
        `Error obteniendo herramientas: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Endpoint de compatibilidad para generar respuesta simple sin MCP
   */
  @Post('generate/simple')
  async generateSimple(@Body() request: { prompt: string; model?: string }) {
    if (!request.prompt) {
      throw new HttpException('El prompt es requerido', HttpStatus.BAD_REQUEST);
    }

    try {
      const response = await this.enhancedOllamaService.generateResponse(
        request.prompt,
        request.model,
      );

      return {
        success: true,
        data: {
          response: response,
          model: request.model || 'default',
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      throw error;
    }
  }
}
