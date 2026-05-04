export class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    login = async (request, response) => {
        const result = await this.authService.login(request.body);
        response.status(200).json({
            success: true,
            data: result
        });
    };
}
