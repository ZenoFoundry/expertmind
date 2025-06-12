import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OllamaModule } from './ollama/ollama.module.js';
import { MCPModule } from './mcp/mcp.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    OllamaModule,
    MCPModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
