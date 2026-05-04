import { ApiError } from '../../common/errors/api-error.js';
const isHttpError = (error) => typeof error === 'object' && error !== null;
const toStatusCode = (error) => {
    if (!isHttpError(error) || typeof error.statusCode !== 'number') {
        return 500;
    }
    return Number.isInteger(error.statusCode) && error.statusCode >= 400 && error.statusCode <= 599 ? error.statusCode : 500;
};
const shouldLogError = (statusCode) => statusCode >= 500 && process.env.NODE_ENV !== 'test';
export const errorMiddleware = (error, _request, response, _next) => {
    const statusCode = toStatusCode(error);
    const message = statusCode === 500 || !isHttpError(error) || typeof error.message !== 'string'
        ? 'Internal server error'
        : error.message;
    if (shouldLogError(statusCode)) {
        console.error('Unhandled request error', error);
    }
    response.status(statusCode).json({
        success: false,
        message,
        ...(error instanceof ApiError && error.errors.length > 0 ? { errors: error.errors } : {})
    });
};
