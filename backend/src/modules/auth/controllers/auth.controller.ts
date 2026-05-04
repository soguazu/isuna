import type { Response } from 'express';
import type { SuccessResponse } from '@/common/types/http.js';
import type { LoginRequest } from '@/modules/auth/dtos/login.dto.js';
import type { AuthService, LoginResult } from '@/modules/auth/services/auth.service.js';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  login = async (request: LoginRequest, response: Response<SuccessResponse<LoginResult>>): Promise<void> => {
    const result = await this.authService.login(request.body);

    response.status(200).json({
      success: true,
      data: result
    });
  };
}
