import { RowDataPacket } from "mysql2";
import database from "../config/database";

interface DashboardRow extends RowDataPacket {
    totalTasks: number;
    pendingTasks: number;
    inProgressTasks: number;
    completedTasks: number;
    overdueTasks: number;
}

export interface DashboardSummary {
    totalTasks: number;
    pendingTasks: number;
    inProgressTasks: number;
    completedTasks: number;
    overdueTasks: number;
}

export const getDashboardSummaryForUser = async (
    userId: number
): Promise<DashboardSummary> => {
    const [rows] = await database.execute<DashboardRow[]>(
        `
    SELECT
      COUNT(*) AS totalTasks,

      SUM(
        CASE
          WHEN status = 'Pending' THEN 1
          ELSE 0
        END
      ) AS pendingTasks,

      SUM(
        CASE
          WHEN status = 'In Progress' THEN 1
          ELSE 0
        END
      ) AS inProgressTasks,

      SUM(
        CASE
          WHEN status = 'Completed' THEN 1
          ELSE 0
        END
      ) AS completedTasks,

      SUM(
        CASE
          WHEN due_date < CURDATE()
               AND status != 'Completed'
          THEN 1
          ELSE 0
        END
      ) AS overdueTasks

    FROM tasks
    WHERE user_id = ?
    `,
        [userId]
    );

    const summary = rows[0];

    return {
        totalTasks: Number(summary?.totalTasks || 0),
        pendingTasks: Number(summary?.pendingTasks || 0),
        inProgressTasks: Number(
            summary?.inProgressTasks || 0
        ),
        completedTasks: Number(
            summary?.completedTasks || 0
        ),
        overdueTasks: Number(
            summary?.overdueTasks || 0
        ),
    };
};