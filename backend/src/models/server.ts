import express, { type ErrorRequestHandler } from 'express';
import { conectarDB } from '../database/config.js';
import { notasRouter } from '../routes/notas.routes.js';

export class Server {
  readonly app = express();

  constructor() {
    this.app.use(express.json({ limit: '16kb' }));
    this.app.use('/api/notas', notasRouter);
    const manejarError: ErrorRequestHandler = (error, _req, res, _next) => {
      const status = error.status === 400 || error.name === 'ValidationError' ? 400 : 500;
      res.status(status).json({ mensaje: status === 400 ? 'Datos inválidos.' : 'Error del servidor.' });
    };
    this.app.use(manejarError);
  }

  async iniciar() {
    await conectarDB();
    const port = Number(process.env.PORT ?? 3000);
    return this.app.listen(port, () => console.log(`API: http://localhost:${port}/api/notas`));
  }
}
