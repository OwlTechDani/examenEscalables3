import { model, Schema } from 'mongoose';

const notaSchema = new Schema({
  titulo: { type: String, required: true, trim: true },
  contenido: { type: String, required: true, trim: true },
}, { versionKey: false });

export const Nota = model('Nota', notaSchema);
