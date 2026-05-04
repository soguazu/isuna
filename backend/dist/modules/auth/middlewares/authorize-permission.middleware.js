import { ApiError } from '../../../common/errors/api-error.js';
import { hasPermission } from '../../../modules/auth/policies/permissions.js';
export const authorizePermission = (permission) => {
    return (request, _response, next) => {
        if (!request.user) {
            next(new ApiError('Authentication required', 401));
            return;
        }
        if (!hasPermission(request.user, permission)) {
            next(new ApiError('Forbidden', 403));
            return;
        }
        next();
    };
};
