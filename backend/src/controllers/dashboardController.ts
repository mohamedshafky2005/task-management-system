import { Response } from "express";
import { AuthenticatedRequest } from "../types/express";
import {
    getDashboardSummaryForUser,
} from "../services/dashboardService";

export const getDashboardSummary = async (
    request: AuthenticatedRequest,
    response: Response
): Promise<void> => {
    try {
        const userId = request.user?.userId;

        if (!userId) {
            response.status(401).json({
                success: false,
                message: "User is not authenticated",
            });
            return;
        }

        const summary =
            await getDashboardSummaryForUser(userId);

        response.status(200).json({
            success: true,
            data: summary,
        });
    } catch (error) {
        console.error(
            "Dashboard summary error:",
            error
        );

        response.status(500).json({
            success: false,
            message:
                "Unable to retrieve dashboard summary",
        });
    }
};