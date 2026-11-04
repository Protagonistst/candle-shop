import { promises as fs } from 'node:fs';
import path from 'node:path';
import { seedProducts } from '../shared/catalog.js';
import type { ContactMessage, Order, Product, Subscriber } from '../shared/types.js';
import { buildSeedOrders } from './seed.js';

// A small JSON-file database. It is plenty for a demo store and keeps the
// project free of native dependencies. Writes are serialised through a
// promise chain and written atomically (temp file + rename).

export interface Database {
  products: Product[];
  orders: Order[];
  messages: ContactMessage[];
  subscribers: Subscriber[];
  idempotency: Record<string, string>; // idempotency key -> order id
}

const DATA_DIR = process.env.DATA_DIR ?? (process.env.VERCEL ? '/tmp/amber-glow' : path.resolve('server/.data'));
const DB_FILE = path.join(DATA_DIR, 'db.json');

let cache: Database | null = null;
let writeChain: Promise<void> = Promise.resolve();

export function freshDatabase(): Database {
  const products = structuredClone(seedProducts);
  return {
    products,
    orders: buildSeedOrders(products),
    messages: [],
    subscribers: [],
    idempotency: {},
  };
}

export async function getDb(): Promise<Database> {
  if (cache) return cache;
  try {
    const raw = await fs.readFile(DB_FILE, 'utf8');
    cache = JSON.parse(raw) as Database;
  } catch {
    cache = freshDatabase();
    await persist();
  }
  return cache;
}

export function persist(): Promise<void> {
  const snapshot = JSON.stringify(cache, null, 2);
  writeChain = writeChain
    .catch(() => undefined)
    .then(async () => {
      await fs.mkdir(DATA_DIR, { recursive: true });
      const tmp = `${DB_FILE}.${process.pid}.tmp`;
      await fs.writeFile(tmp, snapshot, 'utf8');
      await fs.rename(tmp, DB_FILE);
    });
  return writeChain;
}

export async function resetDb(): Promise<Database> {
  cache = freshDatabase();
  await persist();
  return cache;
}
