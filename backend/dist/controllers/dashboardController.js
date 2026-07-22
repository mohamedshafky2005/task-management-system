"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardSummary = void 0;
const dashboardService_1 = require("../services/dashboardService");
const getDashboardSummary = async (request, response) => {
    try {
        const userId = request.user?.userId;
        if (!userId) {
            response.status(401).json({
                success: false,
                message: "User is not authenticated",
            });
            return;
        }
        const summary = await (0, dashboardService_1.getDashboardSummaryForUser)(userId);
        response.status(200).json({
            success: true,
            data: summary,
        });
    }
    catch (error) {
        console.error("Dashboard summary error:", error);
        response.status(500).json({
            success: false,
            message: "Unable to retrieve dashboard summary",
        });
    }
};
exports.getDashboardSummary = getDashboardSummary;
//# sourceMappingURL=dashboardController.js.map