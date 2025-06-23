import { Controller, Get } from '@nestjs/common';
import { DiskHealthIndicator, HealthCheck, HealthCheckService, MemoryHealthIndicator, MongooseHealthIndicator } from '@nestjs/terminus';
import { DatabaseService } from 'src/database/database.service';

@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private readonly mongooseHealth: MongooseHealthIndicator,
        private readonly memoryHealth: MemoryHealthIndicator,
        private readonly diskHealth: DiskHealthIndicator,
        private readonly databaseService: DatabaseService,
    ) {}

    @Get()
    @HealthCheck()
    check() {
        return this.health.check([
          // MongoDB health check
          () =>
            this.mongooseHealth.pingCheck('mongodb', {
              connection: this.databaseService.getMongoConnection(),
            }),


          // Memory health check
          () => this.memoryHealth.checkHeap('memory_heap', 150 * 1024 * 1024),
          () => this.memoryHealth.checkRSS('memory_rss', 150 * 1024 * 1024),

          // Disk health check
          () =>
            this.diskHealth.checkStorage('disk', {
              thresholdPercent: 0.9,
              path: '/',
            }),
        ]);
    }

    @Get('databases')
    @HealthCheck()
    checkDatabases() {
        return this.health.check([
            () =>
            this.mongooseHealth.pingCheck('mongodb', {
                connection: this.databaseService.getMongoConnection(),
            }),
        ]);
    }
}
