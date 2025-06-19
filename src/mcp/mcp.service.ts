import { Injectable, Logger } from '@nestjs/common';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { readFileSync } from 'fs';
import { join } from 'path';

export interface MCPTool {
  name: string;
  description?: string;
  inputSchema?: any;
}

@Injectable()
export class MCPService {
  private readonly logger = new Logger(MCPService.name);
  private clients: Map<string, Client> = new Map();
  private availableTools: MCPTool[] = [];

  async onModuleInit() {
    await this.initializeMCPServers();
  }

  private async initializeMCPServers() {
    try {
      // Leer configuración MCP
      const configPath = join(process.cwd(), 'mcp-config.json');
      const config = JSON.parse(readFileSync(configPath, 'utf-8'));

      for (const [serverName, serverConfig] of Object.entries(config.mcpServers)) {
        await this.connectToMCPServer(serverName, serverConfig as any);
      }

      this.logger.log(`✅ Initialized ${this.clients.size} MCP servers`);
    } catch (error) {
      this.logger.error(`❌ Error initializing MCP servers: ${error.message}`);
    }
  }

  private async connectToMCPServer(serverName: string, config: any) {
    try {
      this.logger.log(`🔌 Connecting to MCP server: ${serverName}`);

      // Crear transporte para el servidor MCP
      const transport = new StdioClientTransport({
        command: config.command,
        args: config.args,
        env: { ...process.env, ...config.env },
      });

      // Crear cliente MCP
      const client = new Client(
        {
          name: `expertmind-${serverName}`,
          version: '1.0.0',
        },
        {
          capabilities: {
            tools: {},
            resources: {},
          },
        },
      );

      // Conectar
      await client.connect(transport);

      // Obtener herramientas disponibles
      const { tools } = await client.listTools();
      
      // Agregar prefijo del servidor a las herramientas
      const serverTools = tools.map(tool => ({
        ...tool,
        name: `${serverName}_${tool.name}`,
        serverName: serverName,
      }));

      this.availableTools.push(...serverTools);
      this.clients.set(serverName, client);

      this.logger.log(`✅ Connected to ${serverName} with ${tools.length} tools`);
      this.logger.log(`🛠️ Available tools: ${tools.map(t => t.name).join(', ')}`);

    } catch (error) {
      this.logger.error(`❌ Failed to connect to ${serverName}: ${error.message}`);
    }
  }

  /**
   * Obtiene todas las herramientas disponibles de todos los servidores MCP
   */
  getAvailableTools(): MCPTool[] {
    return this.availableTools;
  }

  /**
   * Ejecuta una herramienta MCP específica
   */
  async executeTool(toolName: string, args: any): Promise<any> {
    try {
      // Encontrar el servidor que contiene la herramienta
      const tool = this.availableTools.find(t => t.name === toolName);
      if (!tool) {
        throw new Error(`Tool ${toolName} not found`);
      }

      const serverName = (tool as any).serverName;
      const originalToolName = toolName.replace(`${serverName}_`, '');
      const client = this.clients.get(serverName);

      if (!client) {
        throw new Error(`Client for server ${serverName} not found`);
      }

      this.logger.log(`🛠️ Executing tool: ${originalToolName} on server: ${serverName}`);
      
      const result = await client.callTool({
        name: originalToolName,
        arguments: args,
      });

      return result;
    } catch (error) {
      this.logger.error(`❌ Error executing tool ${toolName}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Analiza un prompt para detectar si necesita herramientas MCP
   */
  async analyzePromptForTools(prompt: string): Promise<{
    needsTools: boolean;
    suggestedTools: string[];
    enhancedPrompt: string;
  }> {
    const lowerPrompt = prompt.toLowerCase();
    const suggestedTools: string[] = [];

    // Detectar patrones que indican necesidad de herramientas GitLab
    if (lowerPrompt.includes('gitlab') || 
        lowerPrompt.includes('repository') || 
        lowerPrompt.includes('repo') ||
        lowerPrompt.includes('issue') ||
        lowerPrompt.includes('merge request') ||
        lowerPrompt.includes('commit') ||
        lowerPrompt.includes('branch')) {
      
      const gitlabTools = this.availableTools.filter(t => t.name.startsWith('gitlab_'));
      suggestedTools.push(...gitlabTools.map(t => t.name));
    }

    // Crear prompt mejorado con información de herramientas disponibles
    let enhancedPrompt = prompt;
    
    if (suggestedTools.length > 0) {
      enhancedPrompt += `\n\n[Herramientas MCP disponibles: ${suggestedTools.join(', ')}]`;
    }

    return {
      needsTools: suggestedTools.length > 0,
      suggestedTools,
      enhancedPrompt,
    };
  }

  /**
   * Cierra todas las conexiones MCP
   */
  async onModuleDestroy() {
    for (const [serverName, client] of this.clients) {
      try {
        await client.close();
        this.logger.log(`🔌 Disconnected from ${serverName}`);
      } catch (error) {
        this.logger.error(`❌ Error disconnecting from ${serverName}: ${error.message}`);
      }
    }
  }
}
