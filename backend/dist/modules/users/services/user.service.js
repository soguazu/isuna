import { ApiError } from '../../../common/errors/api-error.js';
import { canDisableUser, canReadUser, canUpdateUser, hasPermission } from '../../../modules/auth/policies/permissions.js';
export class UserService {
    userRepository;
    passwordService;
    constructor(userRepository, passwordService) {
        this.userRepository = userRepository;
        this.passwordService = passwordService;
    }
    async createUser(actor, input) {
        if (!hasPermission(actor, 'users:create')) {
            throw new ApiError('Forbidden', 403);
        }
        return this.createUserWithoutActor(input);
    }
    async listUsers(actor) {
        if (!hasPermission(actor, 'users:read:list')) {
            throw new ApiError('Forbidden', 403);
        }
        return this.userRepository.findAll();
    }
    async retrieveUser(actor, id) {
        const user = await this.requireUser(id);
        if (!canReadUser(actor, user)) {
            throw new ApiError('Forbidden', 403);
        }
        return user;
    }
    async retrieveProfile(actor) {
        return this.requireUser(actor.id);
    }
    async updateProfile(actor, input) {
        const safeInput = this.toSafeProfileUpdate(input);
        const user = await this.userRepository.updateById(actor.id, safeInput);
        if (!user) {
            throw new ApiError('User not found', 404);
        }
        return user;
    }
    async updateUser(actor, id, input) {
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
    async disableUser(actor, id) {
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
    async findActiveUserByEmail(email) {
        const user = await this.userRepository.findByEmail(email);
        return user?.isActive ? user : null;
    }
    async findActiveUserById(id) {
        const user = await this.userRepository.findById(id);
        return user?.isActive ? user : null;
    }
    async ensureSuperAdmin(input) {
        const existingUser = await this.userRepository.findByEmail(input.email);
        if (existingUser) {
            return existingUser;
        }
        return this.createUserWithoutActor({
            ...input,
            role: 'super_admin'
        });
    }
    verifyPassword(password, passwordHash) {
        return this.passwordService.verify(password, passwordHash);
    }
    async createUserWithoutActor(input) {
        try {
            return await this.userRepository.create({
                name: input.name,
                email: input.email,
                passwordHash: this.passwordService.hash(input.password),
                role: input.role,
                isActive: true
            });
        }
        catch (error) {
            if (error instanceof Error && error.name === 'SequelizeUniqueConstraintError') {
                throw new ApiError('Email already exists', 409);
            }
            throw error;
        }
    }
    async requireUser(id) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new ApiError('User not found', 404);
        }
        return user;
    }
    toSafeProfileUpdate(input) {
        return {
            ...(input.name !== undefined ? { name: input.name } : {}),
            ...(input.email !== undefined ? { email: input.email } : {}),
            ...(input.password !== undefined ? { passwordHash: this.passwordService.hash(input.password) } : {})
        };
    }
    toAdministrativeUpdate(input) {
        return {
            ...(input.name !== undefined ? { name: input.name } : {}),
            ...(input.email !== undefined ? { email: input.email } : {}),
            ...(input.password !== undefined ? { passwordHash: this.passwordService.hash(input.password) } : {}),
            ...(input.role !== undefined ? { role: input.role } : {}),
            ...(input.isActive !== undefined ? { isActive: input.isActive } : {})
        };
    }
}
