import { Router } from "express";
import {
    getDashboardSummary,
} from "../controllers/dashboardController";
import {
    authenticate,
} from "../middleware/authMiddleware";

const router = Router();

router.get(
    "/summary",
    authenticate,
    getDashboardSummary
);

export default router;