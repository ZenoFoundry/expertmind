import { Injectable, Inject } from '@nestjs/common';
import { Connection } from 'mongoose';
import * as mongoose from 'mongoose';

@Injectable()
export class DatabaseService {
  constructor(
    @Inject('MONGO_DATABASE_CONNECTION')
    private readonly connection: typeof mongoose,
  ) {}

  getMongoConnection(): Connection {
    return this.connection.connection;
  }

  isConnected(): boolean {
    return this.connection.connection.readyState === 1;
  }

  getConnectionState(): string {
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };
    return states[this.connection.connection.readyState] || 'unknown';
  }

  getDatabaseInfo() {
    return {
      name: this.connection.connection.name,
      host: this.connection.connection.host,
      port: this.connection.connection.port,
      readyState: this.getConnectionState(),
    };
  }
}