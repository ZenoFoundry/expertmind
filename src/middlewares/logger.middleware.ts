
import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  // Método para sanitizar headers y eliminar información sensible
  private sanitizeHeaders(headers: any): any {
    const sanitized = { ...headers };
    
    // Ocultar información sensible en los headers
    const sensitiveHeaders = ['authorization', 'cookie', 'set-cookie'];
    sensitiveHeaders.forEach(header => {
      if (sanitized[header]) {
        sanitized[header] = '[REDACTED]';
      }
    });
    
    return sanitized;
  }

  // Método para determinar si se debe registrar el payload completo
  private shouldLogPayload(payload: any): boolean {
    if (!payload) return true;
    
    try {
      // No registrar payloads muy grandes (más de 10KB)
      const payloadSize = JSON.stringify(payload).length;
      return payloadSize <= 10240; // 10KB
    } catch (error) {
      return false;
    }
  }

  use(req: FastifyRequest, res: FastifyReply, next: () => void) {
    // Capturar y formatear información de la solicitud
    const requestInfo = {
      method: req.method,
      url: req.url,
      params: req.params || {},
      query: req.query || {},
      body: req.body || {},
      headers: this.sanitizeHeaders(req.headers)
    };
    
    console.log('Request...', JSON.stringify(requestInfo, null, 2));
    
    // Capturar el tiempo de inicio
    const start = Date.now();
    
    // Extender el objeto res para capturar la respuesta
    const originalEnd = res.send;
    const self = this;
    res.send = function (payload: any) {
      const responseTime = Date.now() - start;
      
      // Capturar información de la respuesta
      const responseInfo = {
        statusCode: res.statusCode,
        responseTime: `${responseTime}ms`,
        headers: res.getHeaders ? res.getHeaders() : {},
        payload: self.shouldLogPayload(payload) ? payload : '[PAYLOAD TOO LARGE]'
      };
      
      console.log(`Response...`, JSON.stringify(responseInfo, null, 2));
      
      // Restaurar el método original y continuar
      res.send = originalEnd;
      return res.send(payload);
    };
    
    next();
  }
}


