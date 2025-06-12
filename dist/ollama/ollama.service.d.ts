import { ConfigService } from '@nestjs/config';
export declare class OllamaService {
    private configService;
    private readonly ollamaUrl;
    private readonly defaultModel;
    constructor(configService: ConfigService);
    generateResponse(prompt: string, model?: string): Promise<string>;
    warmupModel(model?: string): Promise<void>;
    chatCompletion(messages: any[], model?: string): Promise<string>;
    getAvailableModels(): Promise<any[]>;
    private getAvailableModelNames;
    checkOllamaHealth(): Promise<boolean>;
}
