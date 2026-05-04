import type { Request, Response } from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';
import { ApiError } from '@/common/errors/api-error.js';
import type { SuccessResponse } from '@/common/types/http.js';
import type { User } from '@/modules/users/repositories/user.repository.types.js';
import type { CreateUserBodyDto, UpdateUserBodyDto } from '@/modules/users/dtos/user.dto.js';
import type { UserService } from '@/modules/users/services/user.service.js';

type UserIdParams = {
  id: string;
};

export class UserController {
  constructor(private readonly userService: UserService) {}

  create = async (
    request: Request<ParamsDictionary, SuccessResponse<User>, CreateUserBodyDto>,
    response: Response<SuccessResponse<User>>
  ): Promise<void> => {
    const user = await this.userService.createUser(this.requireActor(request), request.body);

    response.status(201).json({
      success: true,
      data: user
    });
  };

  list = async (_request: Request, response: Response<SuccessResponse<User[]>>): Promise<void> => {
    const user = this.requireActor(_request);
    const users = await this.userService.listUsers(user);

    response.status(200).json({
      success: true,
      data: users
    });
  };

  retrieve = async (
    request: Request<UserIdParams, SuccessResponse<User>>,
    response: Response<SuccessResponse<User>>
  ): Promise<void> => {
    const user = await this.userService.retrieveUser(this.requireActor(request), request.params.id);

    response.status(200).json({
      success: true,
      data: user
    });
  };

  update = async (
    request: Request<UserIdParams, SuccessResponse<User>, UpdateUserBodyDto>,
    response: Response<SuccessResponse<User>>
  ): Promise<void> => {
    const user = await this.userService.updateUser(this.requireActor(request), request.params.id, request.body);

    response.status(200).json({
      success: true,
      data: user
    });
  };

  disable = async (
    request: Request<UserIdParams, SuccessResponse<User>>,
    response: Response<SuccessResponse<User>>
  ): Promise<void> => {
    const user = await this.userService.disableUser(this.requireActor(request), request.params.id);

    response.status(200).json({
      success: true,
      data: user
    });
  };

  me = async (request: Request, response: Response<SuccessResponse<User>>): Promise<void> => {
    const user = await this.userService.retrieveProfile(this.requireActor(request));

    response.status(200).json({
      success: true,
      data: user
    });
  };

  updateMe = async (
    request: Request<ParamsDictionary, SuccessResponse<User>, UpdateUserBodyDto>,
    response: Response<SuccessResponse<User>>
  ): Promise<void> => {
    const user = await this.userService.updateProfile(this.requireActor(request), request.body);

    response.status(200).json({
      success: true,
      data: user
    });
  };

  private requireActor(request: Request) {
    if (!request.user) {
      throw new ApiError('Authentication required', 401);
    }

    return request.user;
  }
}
