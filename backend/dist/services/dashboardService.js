"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardSummaryForUser = void 0;
const database_1 = __importDefault(require("../config/database"));
const getDashboardSummaryForUser = async (userId) => {
    const [rows] = await database_1.default.execute(`
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
    `, [userId]);
    const summary = rows[0];
    return {
        totalTasks: Number(summary?.totalTasks || 0),
        pendingTasks: Number(summary?.pendingTasks || 0),
        inProgressTasks: Number(summary?.inProgressTasks || 0),
        completedTasks: Number(summary?.completedTasks || 0),
        overdueTasks: Number(summary?.overdueTasks || 0),
    };
};
exports.getDashboardSummaryForUser = getDashboardSummaryForUser;
//# sourceMappingURL=dashboardService.js.map