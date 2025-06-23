import { registerAs } from '@nestjs/config';

export const CONFIG_DATABASE = 'database';

export default registerAs(CONFIG_DATABASE, () => ({
  mongo: {
    uri: process.env.MONGODB_URI,
  },
}));