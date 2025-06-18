import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OllamaModule } from './ollama/ollama.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    OllamaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
