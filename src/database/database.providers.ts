
import { ConfigService } from '@nestjs/config';
import * as mongoose from 'mongoose';
import { CONFIG_DATABASE } from 'src/config/database.config';

export const databaseProviders = [
  {
    provide: 'MONGO_DATABASE_CONNECTION',
    useFactory: async (configService: ConfigService): Promise<typeof mongoose> => {
      const uri = configService.get(CONFIG_DATABASE).mongo.uri;
      return mongoose.connect(uri);
    },
    inject: [ConfigService],
  },
];
