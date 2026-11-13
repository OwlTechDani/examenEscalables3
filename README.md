# Notas Rápidas

Aplicación para guardar y consultar notas con Angular, Node.js y MongoDB.

## Ejecutar

Necesitas Node.js 24 y Docker o MongoDB local.

```sh
npm ci
docker compose up -d
npm run dev
```

Abre http://127.0.0.1:4200. Si ya tienes MongoDB local en el puerto 27017, omite el comando de Docker.

## Funcionamiento

Escribe un título y un contenido y pulsa Guardar. La nota se guarda en MongoDB y aparece en la lista sin recargar la página.

## Notas

- La API está en http://localhost:3000/api/notas y permite GET y POST.
- Puedes configurar la conexión copiando `backend/.env.example` a `backend/.env`.
- Para compilar: `npm run build`. Para probar: `npm test`.
- La colección para Postman está en `postman/notas.postman_collection.json`.
