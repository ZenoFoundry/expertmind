import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

export interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

@Injectable()
export class OllamaService {
  private readonly client: AxiosInstance;
  private readonly baseUrl: string;

    constructor(private configService: ConfigService) {
      this.baseUrl = this.configService.get<string>(
        'OLLAMA_URL',
        'http://localhost:11434',
      );

      this.client = axios.create({
        baseURL: this.baseUrl,
        timeout: 60000,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

  async generate(model: string, prompt: string): Promise<string> {
    try {
      const response = await this.client.post('/api/generate', {
        model,
        prompt,
        stream: false,
      });

      return response.data.response;
    } catch (error) {
      throw new HttpException(
        `Error al generar respuesta: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async chat(model: string, messages: ChatMessage[]): Promise<string> {
    try {
      const response = await this.client.post('/api/chat', {
        model,
        messages,
        stream: false,
      });

      return response.data.message.content;
    } catch (error) {
      throw new HttpException(
        `Error en chat: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.client.get('/');
      return true;
    } catch (error) {
      return false;
    }
  }
}
