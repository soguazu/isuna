import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const keyLength = 64;

export class PasswordService {
  hash(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const key = scryptSync(password, salt, keyLength).toString('hex');

    return `scrypt$${salt}$${key}`;
  }

  verify(password: string, passwordHash: string): boolean {
    const [algorithm, salt, expectedKey] = passwordHash.split('$');

    if (algorithm !== 'scrypt' || !salt || !expectedKey) {
      return false;
    }

    const actual = Buffer.from(scryptSync(password, salt, keyLength).toString('hex'), 'hex');
    const expected = Buffer.from(expectedKey, 'hex');

    return actual.length === expected.length && timingSafeEqual(actual, expected);
  }
}
