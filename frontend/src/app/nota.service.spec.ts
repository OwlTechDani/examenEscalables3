import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NotaService } from './nota.service';
import { App } from './app';

describe('Notas', () => {
  let service: NotaService;
  let http: HttpTestingController;
  const nota = { _id: '1', titulo: 'Examen', contenido: 'Repasar' };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(NotaService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('carga la respuesta GET en la señal', async () => {
    const pending = service.cargarNotas();
    http.expectOne('/api/notas').flush([nota]);
    await pending;
    expect(service.notas()).toEqual([nota]);
  });

  it('agrega solo después de confirmar el POST y conserva las notas previas', async () => {
    service.notas.set([nota]);
    const pending = service.agregarNota({ titulo: 'Otra', contenido: 'Nueva' });
    const request = http.expectOne('/api/notas');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ titulo: 'Otra', contenido: 'Nueva' });
    expect(service.notas()).toEqual([nota]);
    request.flush({ _id: '2', titulo: 'Otra', contenido: 'Nueva' });
    await pending;
    expect(service.notas().length).toBe(2);
  });

  it('conserva la señal cuando falla el POST', async () => {
    service.notas.set([nota]);
    const pending = service.agregarNota(nota);
    const assertion = expect(pending).rejects.toBeDefined();
    http.expectOne('/api/notas').flush({}, { status: 500, statusText: 'Error' });
    await assertion;
    expect(service.notas()).toEqual([nota]);
  });

  it('muestra la nota guardada sin recargar y limpia los campos', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    http.expectOne('/api/notas').flush([]);
    await fixture.whenStable();
    const app = fixture.componentInstance;
    app.titulo = nota.titulo;
    app.contenido = nota.contenido;
    const pending = app.guardar();
    http.expectOne('/api/notas').flush(nota);
    await pending;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('article').textContent).toContain('Examen');
    expect(app.titulo).toBe('');
    expect(app.contenido).toBe('');
  });
});
