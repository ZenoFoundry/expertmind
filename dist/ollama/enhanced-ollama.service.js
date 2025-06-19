var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EnhancedOllamaService_1;
import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MCPService } from '../mcp/mcp.service.js';
import axios from 'axios';
let EnhancedOllamaService = EnhancedOllamaService_1 = class EnhancedOllamaService {
    configService;
    mcpService;
    logger = new Logger(EnhancedOllamaService_1.name);
    ollamaUrl;
    defaultModel;
    constructor(configService, mcpService) {
        this.configService = configService;
        this.mcpService = mcpService;
        this.ollamaUrl = this.configService.get('OLLAMA_URL', 'http://localhost:11434');
        this.defaultModel = this.configService.get('DEFAULT_MODEL', 'tinyllama');
        this.logger.log(`🔧 Enhanced Ollama URL: ${this.ollamaUrl}`);
        this.logger.log(`🤖 Default Model: ${this.defaultModel}`);
    }
    async generateWithMCP(prompt, model = this.defaultModel, autoExecuteTools = true) {
        this.logger.log(`🚀 Generating response with MCP integration...`);
        try {
            const analysis = await this.mcpService.analyzePromptForTools(prompt);
            this.logger.log(`🔍 MCP Analysis:`, {
                needsTools: analysis.needsTools,
                suggestedTools: analysis.suggestedTools,
            });
            let toolResults = [];
            let toolsUsed = [];
            let finalPrompt = prompt;
            if (analysis.needsTools && autoExecuteTools && analysis.suggestedTools.length > 0) {
                this.logger.log(`🛠️ Executing MCP tools automatically...`);
                for (const toolName of analysis.suggestedTools) {
                    try {
                        if (toolName.includes('list_repositories')) {
                            const result = await this.mcpService.executeTool(toolName, {});
                            toolResults.push({ tool: toolName, result });
                            toolsUsed.push(toolName);
                        }
                    }
                    catch (toolError) {
                        this.logger.warn(`⚠️ Error executing tool ${toolName}: ${toolError.message}`);
                    }
                }
                if (toolResults.length > 0) {
                    const toolContext = toolResults
                        .map(tr => `\\n[${tr.tool}]: ${JSON.stringify(tr.result, null, 2)}`)
                        .join('\\n');
                    finalPrompt = `${prompt}\\n\\nContexto adicional de herramientas MCP:${toolContext}\\n\\nResponde considerando esta información adicional.`;
                }
            }
            const response = await this.generateOllamaResponse(finalPrompt, model);
            return {
                response,
                toolsUsed,
                toolResults,
            };
        }
        catch (error) {
            this.logger.error(`❌ Error in generateWithMCP: ${error.message}`);
            throw error;
        }
    }
    async generateOllamaResponse(prompt, model) {
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
                timeout: 120000,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            this.logger.log(`✅ Successful response from Ollama`);
            return response.data.response;
        }
        catch (error) {
            this.logger.error(`❌ Detailed error:`, {
                message: error.message,
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                timeout: error.code === 'ECONNABORTED',
            });
            if (error.code === 'ECONNABORTED') {
                throw new HttpException(`Timeout: The model is taking more than 2 minutes. Try a shorter prompt or wait for the model to preload.`, HttpStatus.REQUEST_TIMEOUT);
            }
            if (error.code === 'ECONNREFUSED') {
                throw new HttpException(`Could not connect to Ollama at ${this.ollamaUrl}. Check if it's running.`, HttpStatus.SERVICE_UNAVAILABLE);
            }
            if (error.response?.status === 404) {
                throw new HttpException(`Model '${model}' not found.`, HttpStatus.NOT_FOUND);
            }
            throw new HttpException(`Error connecting to Ollama: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async chatWithMCP(messages, model = this.defaultModel, autoExecuteTools = true) {
        const lastUserMessage = messages.filter(m => m.role === 'user').pop();
        if (!lastUserMessage) {
            throw new HttpException('No user message found', HttpStatus.BAD_REQUEST);
        }
        const result = await this.generateWithMCP(lastUserMessage.content, model, autoExecuteTools);
        return result;
    }
    async executeMCPTool(toolName, args) {
        this.logger.log(`🛠️ Manually executing MCP tool: ${toolName}`);
        return await this.mcpService.executeTool(toolName, args);
    }
    getAvailableMCPTools() {
        return this.mcpService.getAvailableTools();
    }
    async generateResponse(prompt, model = this.defaultModel) {
        return await this.generateOllamaResponse(prompt, model);
    }
};
EnhancedOllamaService = EnhancedOllamaService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ConfigService,
        MCPService])
], EnhancedOllamaService);
export { EnhancedOllamaService };
//# sourceMappingURL=enhanced-ollama.service.js.map