import { ApiError } from '../errors/api-error.js';
const isHttpError = (error) => typeof error === 'object' && error !== null;
export const errorMiddleware = (error, _request, response, _next) => {
    const statusCode = isHttpError(error) && typeof error.statusCode === 'number' ? error.statusCode : 500;
    const message = statusCode === 500 || !isHttpError(error) || typeof error.message !== 'string'
        ? 'Internal server error'
        : error.message;
    response.status(statusCode).json({
        success: false,
        message,
        ...(error instanceof ApiError && error.errors.length > 0 ? { errors: error.errors } : {})
    });
};
