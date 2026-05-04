import { ApiError } from '../../../common/errors/api-error.js';
export class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    create = async (request, response) => {
        const user = await this.userService.createUser(this.requireActor(request), request.body);
        response.status(201).json({
            success: true,
            data: user
        });
    };
    list = async (_request, response) => {
        const user = this.requireActor(_request);
        const users = await this.userService.listUsers(user);
        response.status(200).json({
            success: true,
            data: users
        });
    };
    retrieve = async (request, response) => {
        const user = await this.userService.retrieveUser(this.requireActor(request), request.params.id);
        response.status(200).json({
            success: true,
            data: user
        });
    };
    update = async (request, response) => {
        const user = await this.userService.updateUser(this.requireActor(request), request.params.id, request.body);
        response.status(200).json({
            success: true,
            data: user
        });
    };
    disable = async (request, response) => {
        const user = await this.userService.disableUser(this.requireActor(request), request.params.id);
        response.status(200).json({
            success: true,
            data: user
        });
    };
    me = async (request, response) => {
        const user = await this.userService.retrieveProfile(this.requireActor(request));
        response.status(200).json({
            success: true,
            data: user
        });
    };
    updateMe = async (request, response) => {
        const user = await this.userService.updateProfile(this.requireActor(request), request.body);
        response.status(200).json({
            success: true,
            data: user
        });
    };
    requireActor(request) {
        if (!request.user) {
            throw new ApiError('Authentication required', 401);
        }
        return request.user;
    }
}
