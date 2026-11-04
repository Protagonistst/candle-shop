import express from 'express';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { createApp } from './app.js';

// Local / single-server entry point. In production (npm start) it also serves
// the built storefront from dist/, so the whole site runs as one process.

const app = createApp();
// API_PORT wins in development so a PORT meant for the web server is not picked up by mistake.
const PORT = Number(process.env.API_PORT ?? process.env.PORT ?? 8787);
const dist = path.resolve('dist');

if (process.env.NODE_ENV === 'production' && existsSync(dist)) {
  app.use(express.static(dist, { maxAge: '7d', index: false }));
  app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

app.listen(PORT, () => {
  console.log(`Amber & Glow API listening on http://localhost:${PORT}`);
});
