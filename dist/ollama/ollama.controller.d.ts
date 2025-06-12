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
export declare class OllamaController {
    private readonly ollamaService;
    constructor(ollamaService: OllamaService);
    checkHealth(): Promise<{
        success: boolean;
        message: string;
        timestamp: string;
    }>;
    generate(generateRequest: GenerateRequestDto): Promise<{
        success: boolean;
        data: {
            response: string;
            model: string;
            timestamp: string;
        };
    }>;
    chat(chatRequest: ChatRequestDto): Promise<{
        success: boolean;
        data: {
            response: string;
            model: string;
            timestamp: string;
        };
    }>;
    warmupModel(body: {
        model?: string;
    }): Promise<{
        success: boolean;
        message: string;
        timestamp: string;
    }>;
    getModels(): Promise<{
        success: boolean;
        data: {
            models: any[];
            count: number;
            timestamp: string;
        };
    }>;
}
export {};
