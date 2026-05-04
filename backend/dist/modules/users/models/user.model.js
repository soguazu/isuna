import { DataTypes, Model } from 'sequelize';
import { roles } from '../../../modules/auth/auth.types.js';
export class UserModel extends Model {
}
export const initUserModel = (sequelize) => {
    UserModel.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(120),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(254),
            allowNull: false,
            unique: true
        },
        passwordHash: {
            type: DataTypes.STRING(255),
            allowNull: false,
            field: 'password_hash'
        },
        role: {
            type: DataTypes.ENUM(...roles),
            allowNull: false
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            field: 'is_active'
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'created_at'
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'updated_at'
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'deleted_at'
        }
    }, {
        sequelize,
        tableName: 'users',
        timestamps: true,
        paranoid: true,
        underscored: true
    });
    return UserModel;
};
