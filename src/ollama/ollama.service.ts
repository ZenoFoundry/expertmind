import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class OllamaService {
  private readonly ollamaUrl: string;
  private readonly defaultModel: string;

  constructor(private configService: ConfigService) {
    this.ollamaUrl = this.configService.get<string>('OLLAMA_URL', 'http://localhost:11434');
    this.defaultModel = this.configService.get<string>('DEFAULT_MODEL', 'phi3:mini');
    console.log(`🔧 Ollama URL configurada: ${this.ollamaUrl}`);
    console.log(`🤖 Modelo por defecto: ${this.defaultModel}`);
  }

  async generateResponse(prompt: string, model: string = this.defaultModel): Promise<string> {
    console.log(`🚀 Enviando solicitud a Ollama...`);
    console.log(`📝 Prompt: ${prompt.substring(0, 100)}...`);
    console.log(`🤖 Modelo: ${model}`);

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

      console.log(`⏰ Iniciando solicitud (puede tardar hasta 2 minutos)...`);
      
      const response = await axios.post(`${this.ollamaUrl}/api/generate`, requestData, {
        timeout: 120000, // 2 minutos timeout
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log(`✅ Respuesta exitosa de Ollama`);
      return response.data.response;
    } catch (error) {
      console.error(`❌ Error detallado:`, {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        timeout: error.code === 'ECONNABORTED',
      });

      if (error.code === 'ECONNABORTED') {
        throw new HttpException(
          `Timeout: El modelo está tardando más de 2 minutos. Intenta con un prompt más corto o espera a que el modelo se precargue.`,
          HttpStatus.REQUEST_TIMEOUT
        );
      }

      if (error.code === 'ECONNREFUSED') {
        throw new HttpException(
          `No se pudo conectar con Ollama en ${this.ollamaUrl}. Verifica que esté ejecutándose.`,
          HttpStatus.SERVICE_UNAVAILABLE
        );
      }

      if (error.response?.status === 404) {
        throw new HttpException(
          `Modelo '${model}' no encontrado. Modelos disponibles: ${await this.getAvailableModelNames()}`,
          HttpStatus.NOT_FOUND
        );
      }

      throw new HttpException(
        `Error al conectar con Ollama: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Método para pre-cargar el modelo
  async warmupModel(model: string = this.defaultModel): Promise<void> {
    console.log(`🔥 Precargando modelo ${model}...`);
    try {
      await this.generateResponse("Hello", model);
      console.log(`✅ Modelo ${model} precargado exitosamente`);
    } catch (error) {
      console.warn(`⚠️ Error al precargar modelo: ${error.message}`);
    }
  }

  async chatCompletion(messages: any[], model: string = this.defaultModel): Promise<string> {
    console.log(`💬 Iniciando chat con modelo: ${model}`);
    
    try {
      const response = await axios.post(`${this.ollamaUrl}/api/chat`, {
        model: model,
        messages: messages,
        stream: false,
        options: {
          temperature: 0.7,
        }
      }, {
        timeout: 120000, // 2 minutos
      });

      return response.data.message.content;
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        throw new HttpException(
          'Timeout en chat. El modelo está tardando más de lo esperado.',
          HttpStatus.REQUEST_TIMEOUT
        );
      }
      throw new HttpException(
        `Error en el chat con Ollama: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAvailableModels(): Promise<any[]> {
    try {
      const response = await axios.get(`${this.ollamaUrl}/api/tags`, {
        timeout: 10000
      });
      return response.data.models || [];
    } catch (error) {
      throw new HttpException(
        `Error al obtener modelos disponibles: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private async getAvailableModelNames(): Promise<string> {
    try {
      const models = await this.getAvailableModels();
      return models.map(m => m.name).join(', ');
    } catch {
      return 'No se pudieron obtener los modelos';
    }
  }

  async checkOllamaHealth(): Promise<boolean> {
    try {
      console.log(`🏥 Verificando salud de Ollama en: ${this.ollamaUrl}`);
      const response = await axios.get(`${this.ollamaUrl}/api/tags`, { timeout: 5000 });
      console.log(`✅ Ollama está saludable. Status: ${response.status}`);
      return true;
    } catch (error) {
      console.error(`❌ Ollama no está saludable:`, error.message);
      return false;
    }
  }
}