import { createHmac, timingSafeEqual } from 'node:crypto';
import { ApiError } from '../../../common/errors/api-error.js';
import { roles } from '../../../modules/auth/auth.types.js';
const textEncoder = new TextEncoder();
const toBase64Url = (input) => Buffer.from(input)
    .toString('base64')
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');
const fromBase64Url = (input) => {
    const base64 = input.replaceAll('-', '+').replaceAll('_', '/');
    const padding = '='.repeat((4 - (base64.length % 4)) % 4);
    return Buffer.from(`${base64}${padding}`, 'base64');
};
const isJwtClaims = (claims) => {
    if (typeof claims !== 'object' || claims === null) {
        return false;
    }
    const candidate = claims;
    return (typeof candidate.id === 'string' &&
        typeof candidate.email === 'string' &&
        typeof candidate.exp === 'number' &&
        typeof candidate.iat === 'number' &&
        roles.includes(candidate.role));
};
export class JwtService {
    secret;
    expiresInSeconds;
    constructor(secret, expiresInSeconds) {
        this.secret = secret;
        this.expiresInSeconds = expiresInSeconds;
    }
    sign(user) {
        const issuedAt = Math.floor(Date.now() / 1000);
        const claims = {
            ...user,
            iat: issuedAt,
            exp: issuedAt + this.expiresInSeconds
        };
        const encodedHeader = toBase64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const encodedPayload = toBase64Url(JSON.stringify(claims));
        const signature = this.signTokenParts(encodedHeader, encodedPayload);
        return `${encodedHeader}.${encodedPayload}.${signature}`;
    }
    verify(token) {
        const [encodedHeader, encodedPayload, signature, ...extraParts] = token.split('.');
        if (!encodedHeader || !encodedPayload || !signature || extraParts.length > 0) {
            throw new ApiError('Invalid authentication token', 401);
        }
        const expectedSignature = this.signTokenParts(encodedHeader, encodedPayload);
        if (!this.isEqualSignature(signature, expectedSignature)) {
            throw new ApiError('Invalid authentication token', 401);
        }
        const header = this.parseTokenPart(encodedHeader);
        if (typeof header !== 'object' ||
            header === null ||
            header.alg !== 'HS256' ||
            header.typ !== 'JWT') {
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
    signTokenParts(encodedHeader, encodedPayload) {
        return toBase64Url(createHmac('sha256', this.secret).update(`${encodedHeader}.${encodedPayload}`).digest());
    }
    parseTokenPart(encodedPart) {
        try {
            return JSON.parse(fromBase64Url(encodedPart).toString('utf8'));
        }
        catch {
            throw new ApiError('Invalid authentication token', 401);
        }
    }
    isEqualSignature(receivedSignature, expectedSignature) {
        const received = textEncoder.encode(receivedSignature);
        const expected = textEncoder.encode(expectedSignature);
        return received.length === expected.length && timingSafeEqual(received, expected);
    }
}
