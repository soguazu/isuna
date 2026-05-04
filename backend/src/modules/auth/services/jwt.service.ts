import { createHmac, timingSafeEqual } from 'node:crypto';
import { ApiError } from '@/common/errors/api-error.js';
import type { AuthenticatedUser, JwtClaims } from '@/modules/auth/auth.types.js';
import { roles } from '@/modules/auth/auth.types.js';

const textEncoder = new TextEncoder();

const toBase64Url = (input: string | Buffer): string =>
  Buffer.from(input)
    .toString('base64')
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');

const fromBase64Url = (input: string): Buffer => {
  const base64 = input.replaceAll('-', '+').replaceAll('_', '/');
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);

  return Buffer.from(`${base64}${padding}`, 'base64');
};

const isJwtClaims = (claims: unknown): claims is JwtClaims => {
  if (typeof claims !== 'object' || claims === null) {
    return false;
  }

  const candidate = claims as Partial<JwtClaims>;

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.email === 'string' &&
    typeof candidate.exp === 'number' &&
    typeof candidate.iat === 'number' &&
    roles.includes(candidate.role as JwtClaims['role'])
  );
};

export class JwtService {
  constructor(
    private readonly secret: string,
    private readonly expiresInSeconds: number
  ) {}

  sign(user: AuthenticatedUser): string {
    const issuedAt = Math.floor(Date.now() / 1000);
    const claims: JwtClaims = {
      ...user,
      iat: issuedAt,
      exp: issuedAt + this.expiresInSeconds
    };
    const encodedHeader = toBase64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const encodedPayload = toBase64Url(JSON.stringify(claims));
    const signature = this.signTokenParts(encodedHeader, encodedPayload);

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  verify(token: string): AuthenticatedUser {
    const [encodedHeader, encodedPayload, signature, ...extraParts] = token.split('.');

    if (!encodedHeader || !encodedPayload || !signature || extraParts.length > 0) {
      throw new ApiError('Invalid authentication token', 401);
    }

    const expectedSignature = this.signTokenParts(encodedHeader, encodedPayload);

    if (!this.isEqualSignature(signature, expectedSignature)) {
      throw new ApiError('Invalid authentication token', 401);
    }

    const header = this.parseTokenPart(encodedHeader);

    if (
      typeof header !== 'object' ||
      header === null ||
      (header as { alg?: unknown }).alg !== 'HS256' ||
      (header as { typ?: unknown }).typ !== 'JWT'
    ) {
      throw new ApiError('Invalid authentication token', 401);
    }

    const claims = this.parseTokenPart(encodedPayload);

    if (!isJwtClaims(claims)) {
      throw new ApiError('Invalid authentication token', 401);
    }

    if (claims.exp <= Math.floor(Date.now() / 1000)) {
      throw new ApiError('Authentication token expired', 401);
    }

    return {
      id: claims.id,
      email: claims.email,
      role: claims.role
    };
  }

  private signTokenParts(encodedHeader: string, encodedPayload: string): string {
    return toBase64Url(createHmac('sha256', this.secret).update(`${encodedHeader}.${encodedPayload}`).digest());
  }

  private parseTokenPart(encodedPart: string): unknown {
    try {
      return JSON.parse(fromBase64Url(encodedPart).toString('utf8')) as unknown;
    } catch {
      throw new ApiError('Invalid authentication token', 401);
    }
  }

  private isEqualSignature(receivedSignature: string, expectedSignature: string): boolean {
    const received = textEncoder.encode(receivedSignature);
    const expected = textEncoder.encode(expectedSignature);

    return received.length === expected.length && timingSafeEqual(received, expected);
  }
}
