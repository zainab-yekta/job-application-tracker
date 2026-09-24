import { describe, it, expect } from 'vitest';
import { createSalt, hashPassword, verifyPassword } from './password';

describe('password hashing', () => {
  it('creates a different random salt each time', () => {
    expect(createSalt()).toMatch(/^[0-9a-f]{32}$/);
    expect(createSalt()).not.toBe(createSalt());
  });

  it('gives the same hash for the same password and salt', async () => {
    const salt = createSalt();
    const hash = await hashPassword('secret1', salt);
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
    expect(await hashPassword('secret1', salt)).toBe(hash);
  });

  it('gives a different hash with a different salt', async () => {
    expect(await hashPassword('secret1', createSalt())).not.toBe(
      await hashPassword('secret1', createSalt()),
    );
  });

  it('never stores the password itself', async () => {
    const hash = await hashPassword('secret1', createSalt());
    expect(hash).not.toContain('secret1');
  });

  it('verifies the right password and rejects others', async () => {
    const salt = createSalt();
    const hash = await hashPassword('secret1', salt);
    expect(await verifyPassword('secret1', salt, hash)).toBe(true);
    expect(await verifyPassword('secret2', salt, hash)).toBe(false);
    expect(await verifyPassword('', salt, hash)).toBe(false);
  });
});
