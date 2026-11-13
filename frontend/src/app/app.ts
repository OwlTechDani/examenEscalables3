import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotaService } from './nota.service';

@Component({ selector: 'app-root', imports: [FormsModule], templateUrl: './app.html' })
export class App implements OnInit {
  readonly servicio = inject(NotaService);
  readonly cargando = signal(true);
  readonly guardando = signal(false);
  readonly error = signal('');
  titulo = '';
  contenido = '';

  async ngOnInit() {
    try {
      await this.servicio.cargarNotas();
    } catch {
      this.error.set('No se pudieron cargar las notas. Verifica que el servidor esté disponible.');
    } finally {
      this.cargando.set(false);
    }
  }

  async guardar() {
    if (this.cargando() || this.guardando() || !this.titulo.trim() || !this.contenido.trim()) return;
    this.guardando.set(true);
    this.error.set('');
    try {
      await this.servicio.agregarNota({ titulo: this.titulo.trim(), contenido: this.contenido.trim() });
      this.titulo = '';
      this.contenido = '';
    } catch {
      this.error.set('No se pudo guardar la nota. Intenta de nuevo.');
    } finally {
      this.guardando.set(false);
    }
  }
}
