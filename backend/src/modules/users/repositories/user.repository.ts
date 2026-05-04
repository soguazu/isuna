import type { User, UserWithPassword } from '@/modules/users/repositories/user.repository.types.js';
import type { UserModel } from '@/modules/users/models/user.model.js';
import type {
  CreateUserData,
  UpdateUserData,
  UserRepository
} from '@/modules/users/repositories/user.repository.types.js';

type UserModelStatic = typeof UserModel;

export class SequelizeUserRepository implements UserRepository {
  constructor(private readonly userModel: UserModelStatic) {}

  async create(data: CreateUserData): Promise<User> {
    const user = await this.userModel.create(data);

    return this.toUser(user);
  }

  async findAll(): Promise<User[]> {
    const users = await this.userModel.findAll({
      order: [
        ['createdAt', 'DESC'],
        ['id', 'DESC']
      ]
    });

    return users.map((user) => this.toUser(user));
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.userModel.findByPk(id);

    return user ? this.toUser(user) : null;
  }

  async findByEmail(email: string): Promise<UserWithPassword | null> {
    const user = await this.userModel.findOne({
      where: {
        email
      }
    });

    return user ? this.toUserWithPassword(user) : null;
  }

  async updateById(id: string, data: UpdateUserData): Promise<User | null> {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      return null;
    }

    await user.update(data);

    return this.toUser(user);
  }

  private toUser(user: UserModel): User {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt ?? null
    };
  }

  private toUserWithPassword(user: UserModel): UserWithPassword {
    return {
      ...this.toUser(user),
      passwordHash: user.passwordHash
    };
  }
}
