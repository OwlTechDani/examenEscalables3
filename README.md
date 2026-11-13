# Notas Rápidas — Examen parcial 3

Angular + Node.js/Express + Mongoose, todo en TypeScript. Solo permite crear y listar notas.

## Ejecutar

Requisitos: Node.js 24 LTS, npm y MongoDB local (o Docker).

```sh
npm ci
docker compose up -d
npm run dev
```

Abre http://127.0.0.1:4200. Si ya tienes MongoDB local en el puerto 27017, omite Docker.
Opcional: copia `backend/.env.example` a `backend/.env` y ajusta `MONGODB_URI` o `PORT`.
Si cambias el puerto de la API, ajusta también `frontend/proxy.conf.json`.

## API y Postman

- `GET /api/notas`: devuelve un arreglo, estado 200.
- `POST /api/notas`: recibe `{"titulo":"Examen","contenido":"Repasar"}`, devuelve la nota con `_id`, estado 201.
- Campos ausentes, vacíos o que no sean texto: estado 400. Fallos internos: estado 500.

Importa `postman/notas.postman_collection.json` en Postman y ejecuta la colección en orden: crear y consultar. La variable `baseUrl` apunta a `http://localhost:3000`. Incluye aserciones para verificar que GET devuelve la nota creada.

## Verificar

```sh
npm run build
npm test
```

El test del backend ejecuta la colección Postman mediante Newman contra un proceso real y temporal de MongoDB, verifica entradas inválidas y comprueba persistencia tras reconectar. La primera ejecución descarga MongoDB y necesita Internet; no utiliza ni modifica la base del usuario. Los tests Angular verifican GET, POST, errores y que la tarjeta aparezca sin recargar.

## Decisiones indispensables

- Separación de responsabilidades y SRP: `routes` define endpoints; `controllers` procesa HTTP; `models/nota.model.ts` define los dos campos obligatorios; `database/config.ts` conecta MongoDB.
- `models/server.ts` encapsula Express y el arranque; `app.ts` solo inicia el servidor. TypeScript mantiene contratos explícitos.
- `NotaService` centraliza HTTP y la `WritableSignal`. La actualización es pesimista: agrega la nota devuelta solo cuando el POST termina correctamente. `@for` refleja el cambio sin recargar.
- El proxy Angular comunica `/api` con Node durante desarrollo. El formulario bloquea envíos vacíos y duplicados mientras guarda, y conserva el texto ante un error.
- API sin sesiones. No se añaden JWT, autenticación ni helpers vacíos porque el examen no los necesita.

Referencias: [HttpClient de Angular](https://angular.dev/api/common/http/provideHttpClient) y [validación de Mongoose](https://mongoosejs.com/docs/validation.html).
