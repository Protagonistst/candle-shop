import { randomBytes } from 'node:crypto';

// Crockford-style alphabet: no 0/O or 1/I confusion when read aloud.
const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

export function randomId(length: number): string {
  const bytes = randomBytes(length);
  let out = '';
  for (let i = 0; i < length; i++) out += ALPHABET[bytes[i] % ALPHABET.length];
  return out;
}
