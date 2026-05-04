import { ApiError } from '../../errors/api-error.js';
const toValidationErrors = (error) => error.issues.map((issue) => {
    const [, ...fieldPath] = issue.path;
    return {
        path: fieldPath.join('.') || issue.path.join('.'),
        message: issue.message
    };
});
export const validateRequest = (schema) => {
    return (request, _response, next) => {
        const result = schema.safeParse({
            body: request.body,
            query: request.query,
            params: request.params
        });
        if (!result.success) {
            next(new ApiError('Validation failed', 422, toValidationErrors(result.error)));
            return;
        }
        const parsedData = result.data;
        request.body = parsedData.body ?? request.body;
        request.query = parsedData.query ?? request.query;
        request.params = parsedData.params ?? request.params;
        next();
    };
};
