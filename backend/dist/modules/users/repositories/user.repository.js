export class SequelizeUserRepository {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    async create(data) {
        const user = await this.userModel.create(data);
        return this.toUser(user);
    }
    async findAll() {
        const users = await this.userModel.findAll({
            order: [
                ['createdAt', 'DESC'],
                ['id', 'DESC']
            ]
        });
        return users.map((user) => this.toUser(user));
    }
    async findById(id) {
        const user = await this.userModel.findByPk(id);
        return user ? this.toUser(user) : null;
    }
    async findByEmail(email) {
        const user = await this.userModel.findOne({
            where: {
                email
            }
        });
        return user ? this.toUserWithPassword(user) : null;
    }
    async updateById(id, data) {
        const user = await this.userModel.findByPk(id);
        if (!user) {
            return null;
        }
        await user.update(data);
        return this.toUser(user);
    }
    toUser(user) {
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
    toUserWithPassword(user) {
        return {
            ...this.toUser(user),
            passwordHash: user.passwordHash
        };
    }
}
