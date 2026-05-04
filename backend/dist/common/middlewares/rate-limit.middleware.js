import { ApiError } from '../../common/errors/api-error.js';
export const createRateLimitMiddleware = (windowMs, maxRequests) => {
    const buckets = new Map();
    return (request, response, next) => {
        const now = Date.now();
        const key = request.ip || request.socket.remoteAddress || 'unknown';
        const bucket = buckets.get(key);
        if (!bucket || bucket.resetAt <= now) {
            buckets.set(key, {
                count: 1,
                resetAt: now + windowMs
            });
            response.setHeader('X-RateLimit-Limit', String(maxRequests));
            response.setHeader('X-RateLimit-Remaining', String(maxRequests - 1));
            next();
            return;
        }
        if (bucket.count >= maxRequests) {
            const retryAfterSeconds = Math.ceil((bucket.resetAt - now) / 1000);
            response.setHeader('Retry-After', String(retryAfterSeconds));
            response.setHeader('X-RateLimit-Limit', String(maxRequests));
            response.setHeader('X-RateLimit-Remaining', '0');
            next(new ApiError('Too many requests', 429));
            return;
        }
        bucket.count += 1;
        response.setHeader('X-RateLimit-Limit', String(maxRequests));
        response.setHeader('X-RateLimit-Remaining', String(maxRequests - bucket.count));
        next();
    };
};
