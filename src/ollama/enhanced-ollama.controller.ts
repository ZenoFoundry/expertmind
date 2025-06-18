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

interface CompareRepositoriesRequest {
  prompt: string;
  repo1: { owner: string; repo: string };
  repo2: { owner: string; repo: string };
  model?: string;
}

@Controller('ai')
export class EnhancedOllamaController {
  constructor(
    private enhancedOllamaService: EnhancedOllamaService,
  ) {}


}
