export class HealthController {
    healthService;
    constructor(healthService) {
        this.healthService = healthService;
    }
    show = (_request, response) => {
        response.status(200).json({
            success: true,
            data: this.healthService.getStatus()
        });
    };
}
