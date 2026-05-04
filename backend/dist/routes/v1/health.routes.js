import { Router } from 'express';
export const createHealthRouter = (healthController) => {
    const router = Router();
    router.get('/health', healthController.show);
    return router;
};
