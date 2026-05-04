import { ApiError } from '@/common/errors/api-error.js';
import type { AuthenticatedUser } from '@/modules/auth/auth.types.js';
import { canDisableUser, canReadUser, canUpdateUser, hasPermission } from '@/modules/auth/policies/permissions.js';
import type { PasswordService } from '@/modules/auth/services/password.service.js';
import type { User } from '@/modules/users/repositories/user.repository.types.js';
import type { CreateUserBodyDto, UpdateUserBodyDto } from '@/modules/users/dtos/user.dto.js';
import type { UserRepository } from '@/modules/users/repositories/user.repository.types.js';

export type EnsureSuperAdminInput = {
  name: string;
  email: string;
  password: string;
};

export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService
  ) {}

  async createUser(actor: AuthenticatedUser, input: CreateUserBodyDto): Promise<User> {
    if (!hasPermission(actor, 'users:create')) {
      throw new ApiError('Forbidden', 403);
    }

    return this.createUserWithoutActor(input);
  }

  async listUsers(actor: AuthenticatedUser): Promise<User[]> {
    if (!hasPermission(actor, 'users:read:list')) {
      throw new ApiError('Forbidden', 403);
    }

    return this.userRepository.findAll();
  }

  async retrieveUser(actor: AuthenticatedUser, id: string): Promise<User> {
    const user = await this.requireUser(id);

    if (!canReadUser(actor, user)) {
      throw new ApiError('Forbidden', 403);
    }

    return user;
  }

  async retrieveProfile(actor: AuthenticatedUser): Promise<User> {
    return this.requireUser(actor.id);
  }

  async updateProfile(actor: AuthenticatedUser, input: UpdateUserBodyDto): Promise<User> {
    const safeInput = this.toSafeProfileUpdate(input);
    const user = await this.userRepository.updateById(actor.id, safeInput);

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    return user;
  }

  async updateUser(actor: AuthenticatedUser, id: string, input: UpdateUserBodyDto): Promise<User> {
    const target = await this.requireUser(id);

    if (!canUpdateUser(actor, target)) {
      throw new ApiError('Forbidden', 403);
    }

    const updateInput = actor.id === target.id ? this.toSafeProfileUpdate(input) : this.toAdministrativeUpdate(input);
    const user = await this.userRepository.updateById(id, updateInput);

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    return user;
  }

  async disableUser(actor: AuthenticatedUser, id: string): Promise<User> {
    const target = await this.requireUser(id);

    if (actor.id === target.id) {
      throw new ApiError('Cannot disable your own user', 403);
    }

    if (!canDisableUser(actor, target)) {
      throw new ApiError('Forbidden', 403);
    }

    const user = await this.userRepository.updateById(id, { isActive: false });

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    return user;
  }

  async findActiveUserByEmail(email: string) {
    const user = await this.userRepository.findByEmail(email);

    return user?.isActive ? user : null;
  }

  async findActiveUserById(id: string): Promise<User | null> {
    const user = await this.userRepository.findById(id);

    return user?.isActive ? user : null;
  }

  async ensureSuperAdmin(input: EnsureSuperAdminInput): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(input.email);

    if (existingUser) {
      return existingUser;
    }

    return this.createUserWithoutActor({
      ...input,
      role: 'super_admin'
    });
  }

  verifyPassword(password: string, passwordHash: string): boolean {
    return this.passwordService.verify(password, passwordHash);
  }

  private async createUserWithoutActor(input: CreateUserBodyDto): Promise<User> {
    try {
      return await this.userRepository.create({
        name: input.name,
        email: input.email,
        passwordHash: this.passwordService.hash(input.password),
        role: input.role,
        isActive: true
      });
    } catch (error) {
      if (error instanceof Error && error.name === 'SequelizeUniqueConstraintError') {
        throw new ApiError('Email already exists', 409);
      }

      throw error;
    }
  }

  private async requireUser(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    return user;
  }

  private toSafeProfileUpdate(input: UpdateUserBodyDto) {
    return {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.email !== undefined ? { email: input.email } : {}),
      ...(input.password !== undefined ? { passwordHash: this.passwordService.hash(input.password) } : {})
    };
  }

  private toAdministrativeUpdate(input: UpdateUserBodyDto) {
    return {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.email !== undefined ? { email: input.email } : {}),
      ...(input.password !== undefined ? { passwordHash: this.passwordService.hash(input.password) } : {}),
      ...(input.role !== undefined ? { role: input.role } : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {})
    };
  }
}
