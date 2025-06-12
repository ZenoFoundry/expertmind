import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MCPClientService } from './mcp-client.service.js';

@Module({
  imports: [ConfigModule],
  providers: [MCPClientService],
  exports: [MCPClientService],
})
export class MCPModule {}
