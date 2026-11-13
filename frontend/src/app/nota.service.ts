import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, type WritableSignal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import type { Nota, NuevaNota } from './nota';

@Injectable({ providedIn: 'root' })
export class NotaService {
  private readonly http = inject(HttpClient);
  readonly notas: WritableSignal<Nota[]> = signal([]);

  async cargarNotas() {
    this.notas.set(await firstValueFrom(this.http.get<Nota[]>('/api/notas')));
  }

  async agregarNota(nuevaNota: NuevaNota) {
    const nota = await firstValueFrom(this.http.post<Nota>('/api/notas', nuevaNota));
    this.notas.update(notas => [...notas, nota]);
  }
}
