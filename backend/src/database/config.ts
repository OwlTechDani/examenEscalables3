import mongoose from 'mongoose';

export const conectarDB = () => mongoose.connect(
  process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/notas_rapidas',
  { serverSelectionTimeoutMS: 5000 },
);
