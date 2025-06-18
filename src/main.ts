import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors();

  // Puerto desde variables de entorno
  const port = process.env.PORT || 3000;

  await app.listen(port);
  console.log(`🚀 ExpertMind API ejecutándose en http://localhost:${port}`);
  console.log(`📋 Endpoints disponibles:`);
  console.log(`  - POST /ai/generate - Generar respuesta simple`);
  console.log(`  - POST /ai/chat - Chat conversacional`);
  console.log(`  - GET /ai/models - Listar modelos disponibles`);
}
bootstrap();
