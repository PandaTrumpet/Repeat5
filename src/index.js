import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoDB.js';

const bootsharp = async () => {
  await initMongoConnection();
  setupServer();
};
bootsharp();
