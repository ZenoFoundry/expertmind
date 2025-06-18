import { Injectable } from '@nestjs/common';
import { OllamaService } from './ollama.service.js';

@Injectable()
export class EnhancedOllamaService {
  constructor(
    private ollamaService: OllamaService,
  ) {}

}
