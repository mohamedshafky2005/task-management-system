"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTaskRecord = exports.updateTaskRecord = exports.getTaskByIdForUser = exports.getTasksForUser = exports.createTaskRecord = void 0;
const database_1 = __importDefault(require("../config/database"));
const createTaskRecord = async (data) => {
    const [result] = await database_1.default.execute(`
                INSERT INTO tasks (
                    user_id,
                    title,
                    description,
                    priority,
                    status,
                    due_date
                )
                VALUES (?, ?, ?, ?, ?, ?)
            `, [
        data.userId,
        data.title,
        data.description || null,
        data.priority,
        data.status,
        data.dueDate,
    ]);
    return (0, exports.getTaskByIdForUser)(result.insertId, data.userId);
};
exports.createTaskRecord = createTaskRecord;
const getTasksForUser = async (userId, options) => {
    const requestedPage = options.page &&
        Number.isInteger(options.page) &&
        options.page > 0
        ? options.page
        : 1;
    const limit = options.limit &&
        Number.isInteger(options.limit) &&
        options.limit > 0 &&
        options.limit <= 100
        ? options.limit
        : 5;
    let whereSql = `
    WHERE user_id = ?
  `;
    const values = [
        userId,
    ];
    if (options.search) {
        whereSql += `
      AND title LIKE ?
    `;
        values.push(`%${options.search}%`);
    }
    if (options.status) {
        whereSql += `
      AND status = ?
    `;
        values.push(options.status);
    }
    if (options.priority) {
        whereSql += `
      AND priority = ?
    `;
        values.push(options.priority);
    }
    let orderSql;
    switch (options.sort) {
        case "oldest":
            orderSql =
                "ORDER BY created_at ASC";
            break;
        case "dueDate":
            orderSql =
                "ORDER BY due_date ASC";
            break;
        case "newest":
        default:
            orderSql =
                "ORDER BY created_at DESC";
            break;
    }
    const [countRows] = await database_1.default.execute(`
                SELECT COUNT(*) AS total
                FROM tasks
                         ${whereSql}
            `, values);
    const totalItems = Number(countRows[0]?.total || 0);
    const totalPages = totalItems === 0
        ? 0
        : Math.ceil(totalItems / limit);
    const page = totalPages === 0
        ? 1
        : Math.min(requestedPage, totalPages);
    const offset = (page - 1) * limit;
    /*
     * MySQL may reject placeholders inside
     * LIMIT and OFFSET with prepared statements.
     *
     * limit and offset are safe to interpolate
     * because they are validated integers created
     * by this backend function.
     */
    const [rows] = await database_1.default.execute(`
                SELECT
                    id,
                    user_id,
                    title,
                    description,
                    priority,
                    status,
                    due_date,
                    created_at,
                    updated_at
                FROM tasks
                         ${whereSql}
                    ${orderSql}
      LIMIT ${limit}
                OFFSET ${offset}
            `, values);
    return {
        tasks: rows,
        totalItems,
        page,
        limit,
        totalPages,
    };
};
exports.getTasksForUser = getTasksForUser;
const getTaskByIdForUser = async (taskId, userId) => {
    const [rows] = await database_1.default.execute(`
                SELECT
                    id,
                    user_id,
                    title,
                    description,
                    priority,
                    status,
                    due_date,
                    created_at,
                    updated_at
                FROM tasks
                WHERE id = ?
                  AND user_id = ?
                    LIMIT 1
            `, [
        taskId,
        userId,
    ]);
    return rows.length > 0
        ? rows[0]
        : null;
};
exports.getTaskByIdForUser = getTaskByIdForUser;
const updateTaskRecord = async (taskId, userId, data) => {
    const [result] = await database_1.default.execute(`
                UPDATE tasks
                SET
                    title = ?,
                    description = ?,
                    priority = ?,
                    status = ?,
                    due_date = ?
                WHERE id = ?
                  AND user_id = ?
            `, [
        data.title,
        data.description || null,
        data.priority,
        data.status,
        data.dueDate,
        taskId,
        userId,
    ]);
    if (result.affectedRows === 0) {
        return null;
    }
    return (0, exports.getTaskByIdForUser)(taskId, userId);
};
exports.updateTaskRecord = updateTaskRecord;
const deleteTaskRecord = async (taskId, userId) => {
    const [result] = await database_1.default.execute(`
                DELETE FROM tasks
                WHERE id = ?
                  AND user_id = ?
            `, [
        taskId,
        userId,
    ]);
    return result.affectedRows > 0;
};
exports.deleteTaskRecord = deleteTaskRecord;
//# sourceMappingURL=taskService.js.map