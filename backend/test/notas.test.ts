import assert from 'node:assert/strict';
import { once } from 'node:events';
import { test } from 'node:test';
import { createRequire } from 'node:module';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Server } from '../src/models/server.js';

const require = createRequire(import.meta.url);

test('API y colección Postman contra MongoDB real temporal', { timeout: 180_000 }, async () => {
  const mongo = await MongoMemoryServer.create();
  let server: ReturnType<Server['app']['listen']> | undefined;
  try {
    await mongoose.connect(mongo.getUri());
    server = new Server().app.listen(0, '127.0.0.1');
    await once(server, 'listening');
    const address = server.address();
    assert(address && typeof address !== 'string');
    const baseUrl = `http://127.0.0.1:${address.port}`;
    await new Promise<void>((resolve, reject) => {
      require('newman').run({
        collection: require('../../postman/notas.postman_collection.json'),
        envVar: [{ key: 'baseUrl', value: baseUrl }],
        reporters: 'cli',
      }, (error: Error | null, summary: { run: { failures: unknown[] } }) => {
        if (error) return reject(error);
        try { assert.equal(summary.run.failures.length, 0); resolve(); } catch (failure) { reject(failure); }
      });
    });
    for (const body of [{}, { titulo: '   ', contenido: 'x' }, { titulo: 1, contenido: 'x' }, { titulo: 'x', contenido: {} }]) {
      const response = await fetch(`${baseUrl}/api/notas`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      });
      assert.equal(response.status, 400);
    }
    const malformed = await fetch(`${baseUrl}/api/notas`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{',
    });
    assert.equal(malformed.status, 400);
    await mongoose.disconnect();
    await mongoose.connect(mongo.getUri());
    const response = await fetch(`${baseUrl}/api/notas`);
    assert.equal((await response.json()).length, 1, 'La nota persiste al reconectar');
  } finally {
    if (server) await new Promise<void>((resolve, reject) => server!.close(error => error ? reject(error) : resolve()));
    await mongoose.disconnect();
    await mongo.stop();
  }
});
