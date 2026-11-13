import type { Request, Response } from 'express';
import { Nota } from '../models/nota.model.js';

export async function obtenerNotas(_req: Request, res: Response) {
  res.json(await Nota.find());
}

export async function crearNota(req: Request, res: Response) {
  const { titulo, contenido } = req.body ?? {};
  if (typeof titulo !== 'string' || typeof contenido !== 'string' ||
      !titulo.trim() || !contenido.trim()) {
    res.status(400).json({ mensaje: 'Título y contenido son obligatorios y deben ser texto.' });
    return;
  }
  res.status(201).json(await Nota.create({ titulo, contenido }));
}
