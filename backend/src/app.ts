import { Server } from './models/server.js';

new Server().iniciar().catch((error: Error) => {
  console.error('No se pudo iniciar el servidor:', error.message);
  process.exitCode = 1;
});
