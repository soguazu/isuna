import { ApiError } from '../../../common/errors/api-error.js';
export class AuthService {
    jwtService;
    userService;
    jwtExpiresInSeconds;
    constructor(jwtService, userService, jwtExpiresInSeconds) {
        this.jwtService = jwtService;
        this.userService = userService;
        this.jwtExpiresInSeconds = jwtExpiresInSeconds;
    }
    async login(input) {
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
    toAuthenticatedUser(user) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };
    }
}
