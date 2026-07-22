import api from "../api/api";

import type {
    DashboardSummary,
} from "../types";

interface DashboardResponse {
    success: boolean;
    data: DashboardSummary;
}

export const fetchDashboardSummary =
    async (): Promise<DashboardSummary> => {
        const response =
            await api.get<DashboardResponse>(
                "/dashboard/summary"
            );

        return response.data.data;
    };