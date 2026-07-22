import {
    ResultSetHeader,
    RowDataPacket,
} from "mysql2";

import database from "../config/database";

export type TaskPriority =
    | "Low"
    | "Medium"
    | "High";

export type TaskStatus =
    | "Pending"
    | "In Progress"
    | "Completed";

export interface TaskRow extends RowDataPacket {
    id: number;
    user_id: number;
    title: string;
    description: string | null;
    priority: TaskPriority;
    status: TaskStatus;
    due_date: string;
    created_at: Date;
    updated_at: Date;
}

export interface CreateTaskData {
    userId: number;
    title: string;
    description?: string | null;
    priority: TaskPriority;
    status: TaskStatus;
    dueDate: string;
}

export interface UpdateTaskData {
    title: string;
    description?: string | null;
    priority: TaskPriority;
    status: TaskStatus;
    dueDate: string;
}

export interface TaskQueryOptions {
    search?: string;
    status?: string;
    priority?: string;
    sort?: string;
    page?: number;
    limit?: number;
}

export interface PaginatedTasks {
    tasks: TaskRow[];
    totalItems: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface CountRow extends RowDataPacket {
    total: number;
}

export const createTaskRecord = async (
    data: CreateTaskData
): Promise<TaskRow | null> => {
    const [result] =
        await database.execute<ResultSetHeader>(
            `
                INSERT INTO tasks (
                    user_id,
                    title,
                    description,
                    priority,
                    status,
                    due_date
                )
                VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                data.userId,
                data.title,
                data.description || null,
                data.priority,
                data.status,
                data.dueDate,
            ]
        );

    return getTaskByIdForUser(
        result.insertId,
        data.userId
    );
};

export const getTasksForUser = async (
    userId: number,
    options: TaskQueryOptions
): Promise<PaginatedTasks> => {
    const requestedPage =
        options.page &&
        Number.isInteger(options.page) &&
        options.page > 0
            ? options.page
            : 1;

    const limit =
        options.limit &&
        Number.isInteger(options.limit) &&
        options.limit > 0 &&
        options.limit <= 100
            ? options.limit
            : 5;

    let whereSql = `
    WHERE user_id = ?
  `;

    const values: Array<string | number> = [
        userId,
    ];

    if (options.search) {
        whereSql += `
      AND title LIKE ?
    `;

        values.push(
            `%${options.search}%`
        );
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

    let orderSql: string;

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

    const [countRows] =
        await database.execute<CountRow[]>(
            `
                SELECT COUNT(*) AS total
                FROM tasks
                         ${whereSql}
            `,
            values
        );

    const totalItems = Number(
        countRows[0]?.total || 0
    );

    const totalPages =
        totalItems === 0
            ? 0
            : Math.ceil(
                totalItems / limit
            );

    const page =
        totalPages === 0
            ? 1
            : Math.min(
                requestedPage,
                totalPages
            );

    const offset =
        (page - 1) * limit;

    /*
     * MySQL may reject placeholders inside
     * LIMIT and OFFSET with prepared statements.
     *
     * limit and offset are safe to interpolate
     * because they are validated integers created
     * by this backend function.
     */
    const [rows] =
        await database.execute<TaskRow[]>(
            `
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
            `,
            values
        );

    return {
        tasks: rows,
        totalItems,
        page,
        limit,
        totalPages,
    };
};

export const getTaskByIdForUser = async (
    taskId: number,
    userId: number
): Promise<TaskRow | null> => {
    const [rows] =
        await database.execute<TaskRow[]>(
            `
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
            `,
            [
                taskId,
                userId,
            ]
        );

    return rows.length > 0
        ? rows[0]
        : null;
};

export const updateTaskRecord = async (
    taskId: number,
    userId: number,
    data: UpdateTaskData
): Promise<TaskRow | null> => {
    const [result] =
        await database.execute<ResultSetHeader>(
            `
                UPDATE tasks
                SET
                    title = ?,
                    description = ?,
                    priority = ?,
                    status = ?,
                    due_date = ?
                WHERE id = ?
                  AND user_id = ?
            `,
            [
                data.title,
                data.description || null,
                data.priority,
                data.status,
                data.dueDate,
                taskId,
                userId,
            ]
        );

    if (result.affectedRows === 0) {
        return null;
    }

    return getTaskByIdForUser(
        taskId,
        userId
    );
};

export const deleteTaskRecord = async (
    taskId: number,
    userId: number
): Promise<boolean> => {
    const [result] =
        await database.execute<ResultSetHeader>(
            `
                DELETE FROM tasks
                WHERE id = ?
                  AND user_id = ?
            `,
            [
                taskId,
                userId,
            ]
        );

    return result.affectedRows > 0;
};