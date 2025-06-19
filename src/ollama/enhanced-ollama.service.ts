import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MCPService } from '../mcp/mcp.service.js';
import axios from 'axios';

@Injectable()
export class EnhancedOllamaService {
  private readonly logger = new Logger(EnhancedOllamaService.name);
  private readonly ollamaUrl: string;
  private readonly defaultModel: string;

  constructor(
    private configService: ConfigService,
    private mcpService: MCPService,
  ) {
    this.ollamaUrl = this.configService.get<string>('OLLAMA_URL', 'http://localhost:11434');
    this.defaultModel = this.configService.get<string>('DEFAULT_MODEL', 'tinyllama');
    this.logger.log(`🔧 Enhanced Ollama URL: ${this.ollamaUrl}`);
    this.logger.log(`🤖 Default Model: ${this.defaultModel}`);
  }

  /**
   * Genera respuesta con integración MCP automática
   */
  async generateWithMCP(
    prompt: string, 
    model: string = this.defaultModel,
    autoExecuteTools: boolean = true
  ): Promise<{
    response: string;
    toolsUsed: string[];
    toolResults: any[];
  }> {
    this.logger.log(`🚀 Generating response with MCP integration...`);
    
    try {
      // 1. Analizar el prompt para detectar herramientas necesarias
      const analysis = await this.mcpService.analyzePromptForTools(prompt);
      
      this.logger.log(`🔍 MCP Analysis:`, {
        needsTools: analysis.needsTools,
        suggestedTools: analysis.suggestedTools,
      });

      let toolResults: any[] = [];
      let toolsUsed: string[] = [];
      let finalPrompt = prompt;

      // 2. Si necesita herramientas y está habilitada la ejecución automática
      if (analysis.needsTools && autoExecuteTools && analysis.suggestedTools.length > 0) {
        this.logger.log(`🛠️ Executing MCP tools automatically...`);
        
        for (const toolName of analysis.suggestedTools) {
          try {
            // Ejecutar herramientas básicas de GitLab como ejemplo
            if (toolName.includes('list_repositories')) {
              const result = await this.mcpService.executeTool(toolName, {});
              toolResults.push({ tool: toolName, result });
              toolsUsed.push(toolName);
            }
            // Agregar más herramientas según necesidades
          } catch (toolError) {
            this.logger.warn(`⚠️ Error executing tool ${toolName}: ${toolError.message}`);
          }
        }

        // 3. Enriquecer el prompt con los resultados de las herramientas
        if (toolResults.length > 0) {
          const toolContext = toolResults
            .map(tr => `\\n[${tr.tool}]: ${JSON.stringify(tr.result, null, 2)}`)
            .join('\\n');
          
          finalPrompt = `${prompt}\\n\\nContexto adicional de herramientas MCP:${toolContext}\\n\\nResponde considerando esta información adicional.`;
        }
      }

      // 4. Generar respuesta con Ollama
      const response = await this.generateOllamaResponse(finalPrompt, model);

      return {
        response,
        toolsUsed,
        toolResults,
      };

    } catch (error) {
      this.logger.error(`❌ Error in generateWithMCP: ${error.message}`);
      throw error;
    }
  }

  /**
   * Método para generar respuesta pura de Ollama (igual que el servicio original)
   */
  private async generateOllamaResponse(prompt: string, model: string): Promise<string> {
    this.logger.log(`🚀 Sending request to Ollama...`);
    this.logger.log(`📝 Prompt: ${prompt.substring(0, 100)}...`);
    this.logger.log(`🤖 Model: ${model}`);

    try {
      const requestData = {
        model: model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
        }
      };

      this.logger.log(`⏰ Starting request (may take up to 2 minutes)...`);
      
      const response = await axios.post(`${this.ollamaUrl}/api/generate`, requestData, {
        timeout: 120000, // 2 minutos timeout
        headers: {
          'Content-Type': 'application/json',
        }
      });

      this.logger.log(`✅ Successful response from Ollama`);
      return response.data.response;
    } catch (error) {
      this.logger.error(`❌ Detailed error:`, {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        timeout: error.code === 'ECONNABORTED',
      });

      if (error.code === 'ECONNABORTED') {
        throw new HttpException(
          `Timeout: The model is taking more than 2 minutes. Try a shorter prompt or wait for the model to preload.`,
          HttpStatus.REQUEST_TIMEOUT
        );
      }

      if (error.code === 'ECONNREFUSED') {
        throw new HttpException(
          `Could not connect to Ollama at ${this.ollamaUrl}. Check if it's running.`,
          HttpStatus.SERVICE_UNAVAILABLE
        );
      }

      if (error.response?.status === 404) {
        throw new HttpException(
          `Model '${model}' not found.`,
          HttpStatus.NOT_FOUND
        );
      }

      throw new HttpException(
        `Error connecting to Ollama: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Método para chat con integración MCP
   */
  async chatWithMCP(
    messages: any[], 
    model: string = this.defaultModel,
    autoExecuteTools: boolean = true
  ): Promise<{
    response: string;
    toolsUsed: string[];
    toolResults: any[];
  }> {
    // Extraer el último mensaje del usuario
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    
    if (!lastUserMessage) {
      throw new HttpException('No user message found', HttpStatus.BAD_REQUEST);
    }

    // Usar el método generateWithMCP para procesar
    const result = await this.generateWithMCP(lastUserMessage.content, model, autoExecuteTools);
    
    return result;
  }

  /**
   * Ejecutar herramienta MCP específica manualmente
   */
  async executeMCPTool(toolName: string, args: any): Promise<any> {
    this.logger.log(`🛠️ Manually executing MCP tool: ${toolName}`);
    return await this.mcpService.executeTool(toolName, args);
  }

  /**
   * Listar herramientas MCP disponibles
   */
  getAvailableMCPTools() {
    return this.mcpService.getAvailableTools();
  }

  /**
   * Generar respuesta simple sin MCP (compatibilidad con servicio original)
   */
  async generateResponse(prompt: string, model: string = this.defaultModel): Promise<string> {
    return await this.generateOllamaResponse(prompt, model);
  }
}
