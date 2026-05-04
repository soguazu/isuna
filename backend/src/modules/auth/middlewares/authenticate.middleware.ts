import type { RequestHandler } from 'express';
import { ApiError } from '@/common/errors/api-error.js';
import type { JwtService } from '@/modules/auth/services/jwt.service.js';
import type { UserService } from '@/modules/users/services/user.service.js';

export const authenticateJwt = (jwtService: JwtService, userService: UserService): RequestHandler => {
  return async (request, _response, next): Promise<void> => {
    const authorization = request.header('authorization');

    if (!authorization) {
      next(new ApiError('Authentication required', 401));
      return;
    }

    const [scheme, token] = authorization.split(' ');

    if (scheme !== 'Bearer' || !token) {
      next(new ApiError('Authentication required', 401));
      return;
    }

    try {
      const tokenUser = jwtService.verify(token);
      const activeUser = await userService.findActiveUserById(tokenUser.id);

      if (!activeUser) {
        next(new ApiError('Authentication required', 401));
        return;
      }

      request.user = {
        id: activeUser.id,
        name: activeUser.name,
        email: activeUser.email,
        role: activeUser.role
      };
      next();
    } catch (error) {
      next(error);
    }
  };
};
