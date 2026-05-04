import { ApiError } from '@/common/errors/api-error.js';
import type { AuthenticatedUser } from '@/modules/auth/auth.types.js';
import type { LoginBodyDto } from '@/modules/auth/dtos/login.dto.js';
import type { JwtService } from '@/modules/auth/services/jwt.service.js';
import type { UserService } from '@/modules/users/services/user.service.js';

export type LoginResult = {
  token: string;
  tokenType: 'Bearer';
  expiresIn: number;
  user: AuthenticatedUser;
};

export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly jwtExpiresInSeconds: number
  ) {}

  async login(input: LoginBodyDto): Promise<LoginResult> {
    const user = await this.userService.findActiveUserByEmail(input.email);

    if (!user || !this.userService.verifyPassword(input.password, user.passwordHash)) {
      throw new ApiError('Invalid email or password', 401);
    }

    const authenticatedUser = this.toAuthenticatedUser(user);

    return {
      token: this.jwtService.sign(authenticatedUser),
      tokenType: 'Bearer',
      expiresIn: this.jwtExpiresInSeconds,
      user: authenticatedUser
    };
  }

  private toAuthenticatedUser(user: AuthenticatedUser): AuthenticatedUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
  }
}
