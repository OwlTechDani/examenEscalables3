export interface NuevaNota {
  titulo: string;
  contenido: string;
}

export interface Nota extends NuevaNota {
  _id: string;
}
