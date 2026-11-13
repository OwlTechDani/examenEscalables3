import { Router } from 'express';
import { crearNota, obtenerNotas } from '../controllers/notas.controller.js';

export const notasRouter = Router();
notasRouter.get('/', obtenerNotas);
notasRouter.post('/', crearNota);
