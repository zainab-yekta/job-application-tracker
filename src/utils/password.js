// Password hashing with the browser's Web Crypto API (PBKDF2 + SHA-256, random
// salt per account). Accounts still live only in this browser, so this keeps a
// readable password out of localStorage but is not a substitute for a server.
const ITERATIONS = 100_000;

const toHex = (buffer) =>
  Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, '0')).join('');

const fromHex = (hex) => new Uint8Array(hex.match(/.{2}/g).map((pair) => parseInt(pair, 16)));

export function createSalt() {
  return toHex(crypto.getRandomValues(new Uint8Array(16)));
}

export async function hashPassword(password, salt) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: fromHex(salt), iterations: ITERATIONS },
    key,
    256,
  );
  return toHex(bits);
}

export async function verifyPassword(password, salt, expectedHash) {
  const hash = await hashPassword(password, salt);
  // Compare every character so the time taken doesn't depend on where they differ
  let difference = hash.length ^ expectedHash.length;
  for (let i = 0; i < hash.length; i += 1) {
    difference |= hash.charCodeAt(i) ^ expectedHash.charCodeAt(i);
  }
  return difference === 0;
}
