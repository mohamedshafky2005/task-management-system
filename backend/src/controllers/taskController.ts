import { Response } from "express";

import {
    createTaskRecord,
    deleteTaskRecord,
    getTaskByIdForUser,
    getTasksForUser,
    updateTaskRecord,
} from "../services/taskService";

import type {
    TaskPriority,
    TaskStatus,
} from "../services/taskService";

import {
    validateTaskInput,
} from "../utils/taskValidation";

import type {
    AuthenticatedRequest,
} from "../types/express";

const allowedStatuses: TaskStatus[] = [
    "Pending",
    "In Progress",
    "Completed",
];

const allowedPriorities:
    TaskPriority[] = [
    "Low",
    "Medium",
    "High",
];

const allowedSortValues = [
    "newest",
    "oldest",
    "dueDate",
];

const getAuthenticatedUserId = (
    request: AuthenticatedRequest
): number | null => {
    return (
        request.user?.userId ?? null
    );
};

const parseTaskId = (
    value:
        | string
        | string[]
        | undefined
): number | null => {
    if (
        !value ||
        Array.isArray(value)
    ) {
        return null;
    }

    const taskId = Number(value);

    if (
        !Number.isInteger(taskId) ||
        taskId <= 0
    ) {
        return null;
    }

    return taskId;
};

export const createTask = async (
    request: AuthenticatedRequest,
    response: Response
): Promise<void> => {
    try {
        const userId =
            getAuthenticatedUserId(
                request
            );

        if (!userId) {
            response
                .status(401)
                .json({
                    success: false,
                    message:
                        "User is not authenticated",
                });

            return;
        }

        const validation =
            validateTaskInput(
                request.body
            );

        if (!validation.isValid) {
            response
                .status(400)
                .json({
                    success: false,
                    message:
                        "Validation failed",
                    errors:
                    validation.errors,
                });

            return;
        }

        const {
            title,
            description,
            priority,
            status,
            dueDate,
        } = request.body;

        const task =
            await createTaskRecord({
                userId,
                title: String(
                    title
                ).trim(),
                description:
                    typeof description ===
                    "string"
                        ? description.trim()
                        : null,
                priority:
                    priority as TaskPriority,
                status:
                    status as TaskStatus,
                dueDate:
                    String(dueDate),
            });

        response
            .status(201)
            .json({
                success: true,
                message:
                    "Task created successfully",
                data: task,
            });
    } catch (error) {
        console.error(
            "Create task error:",
            error
        );

        response
            .status(500)
            .json({
                success: false,
                message:
                    "Unable to create the task",
            });
    }
};

export const getAllTasks =
    async (
        request: AuthenticatedRequest,
        response: Response
    ): Promise<void> => {
        try {
            const userId =
                getAuthenticatedUserId(
                    request
                );

            if (!userId) {
                response
                    .status(401)
                    .json({
                        success: false,
                        message:
                            "User is not authenticated",
                    });

                return;
            }

            const search =
                typeof request.query
                    .search === "string"
                    ? request.query.search.trim()
                    : undefined;

            const status =
                typeof request.query
                    .status === "string"
                    ? request.query.status
                    : undefined;

            const priority =
                typeof request.query
                    .priority === "string"
                    ? request.query.priority
                    : undefined;

            const sort =
                typeof request.query
                    .sort === "string"
                    ? request.query.sort
                    : "newest";

            const page =
                typeof request.query
                    .page === "string"
                    ? Number(
                        request.query.page
                    )
                    : 1;

            const limit =
                typeof request.query
                    .limit === "string"
                    ? Number(
                        request.query.limit
                    )
                    : 5;

            if (
                status &&
                !allowedStatuses.includes(
                    status as TaskStatus
                )
            ) {
                response
                    .status(400)
                    .json({
                        success: false,
                        message:
                            "Invalid status filter",
                    });

                return;
            }

            if (
                priority &&
                !allowedPriorities.includes(
                    priority as TaskPriority
                )
            ) {
                response
                    .status(400)
                    .json({
                        success: false,
                        message:
                            "Invalid priority filter",
                    });

                return;
            }

            if (
                sort &&
                !allowedSortValues.includes(
                    sort
                )
            ) {
                response
                    .status(400)
                    .json({
                        success: false,
                        message:
                            "Invalid sorting option",
                    });

                return;
            }

            if (
                !Number.isInteger(page) ||
                page <= 0
            ) {
                response
                    .status(400)
                    .json({
                        success: false,
                        message:
                            "Page must be a positive integer",
                    });

                return;
            }

            if (
                !Number.isInteger(limit) ||
                limit <= 0 ||
                limit > 100
            ) {
                response
                    .status(400)
                    .json({
                        success: false,
                        message:
                            "Limit must be between 1 and 100",
                    });

                return;
            }

            const result =
                await getTasksForUser(
                    userId,
                    {
                        search,
                        status,
                        priority,
                        sort,
                        page,
                        limit,
                    }
                );

            response
                .status(200)
                .json({
                    success: true,
                    data: result.tasks,
                    pagination: {
                        page: result.page,
                        limit: result.limit,
                        totalItems:
                        result.totalItems,
                        totalPages:
                        result.totalPages,
                    },
                });
        } catch (error) {
            console.error(
                "Get tasks error:",
                error
            );

            response
                .status(500)
                .json({
                    success: false,
                    message:
                        "Unable to retrieve tasks",
                });
        }
    };

export const getTaskById =
    async (
        request: AuthenticatedRequest,
        response: Response
    ): Promise<void> => {
        try {
            const userId =
                getAuthenticatedUserId(
                    request
                );

            const taskId =
                parseTaskId(
                    request.params.id
                );

            if (!userId) {
                response
                    .status(401)
                    .json({
                        success: false,
                        message:
                            "User is not authenticated",
                    });

                return;
            }

            if (!taskId) {
                response
                    .status(400)
                    .json({
                        success: false,
                        message:
                            "Invalid task ID",
                    });

                return;
            }

            const task =
                await getTaskByIdForUser(
                    taskId,
                    userId
                );

            if (!task) {
                response
                    .status(404)
                    .json({
                        success: false,
                        message:
                            "Task not found",
                    });

                return;
            }

            response
                .status(200)
                .json({
                    success: true,
                    data: task,
                });
        } catch (error) {
            console.error(
                "Get task error:",
                error
            );

            response
                .status(500)
                .json({
                    success: false,
                    message:
                        "Unable to retrieve the task",
                });
        }
    };

export const updateTask =
    async (
        request: AuthenticatedRequest,
        response: Response
    ): Promise<void> => {
        try {
            const userId =
                getAuthenticatedUserId(
                    request
                );

            const taskId =
                parseTaskId(
                    request.params.id
                );

            if (!userId) {
                response
                    .status(401)
                    .json({
                        success: false,
                        message:
                            "User is not authenticated",
                    });

                return;
            }

            if (!taskId) {
                response
                    .status(400)
                    .json({
                        success: false,
                        message:
                            "Invalid task ID",
                    });

                return;
            }

            const existingTask =
                await getTaskByIdForUser(
                    taskId,
                    userId
                );

            if (!existingTask) {
                response
                    .status(404)
                    .json({
                        success: false,
                        message:
                            "Task not found",
                    });

                return;
            }

            const validation =
                validateTaskInput(
                    request.body
                );

            if (!validation.isValid) {
                response
                    .status(400)
                    .json({
                        success: false,
                        message:
                            "Validation failed",
                        errors:
                        validation.errors,
                    });

                return;
            }

            const {
                title,
                description,
                priority,
                status,
                dueDate,
            } = request.body;

            const updatedTask =
                await updateTaskRecord(
                    taskId,
                    userId,
                    {
                        title: String(
                            title
                        ).trim(),
                        description:
                            typeof description ===
                            "string"
                                ? description.trim()
                                : null,
                        priority:
                            priority as TaskPriority,
                        status:
                            status as TaskStatus,
                        dueDate:
                            String(dueDate),
                    }
                );

            response
                .status(200)
                .json({
                    success: true,
                    message:
                        "Task updated successfully",
                    data: updatedTask,
                });
        } catch (error) {
            console.error(
                "Update task error:",
                error
            );

            response
                .status(500)
                .json({
                    success: false,
                    message:
                        "Unable to update the task",
                });
        }
    };

export const deleteTask =
    async (
        request: AuthenticatedRequest,
        response: Response
    ): Promise<void> => {
        try {
            const userId =
                getAuthenticatedUserId(
                    request
                );

            const taskId =
                parseTaskId(
                    request.params.id
                );

            if (!userId) {
                response
                    .status(401)
                    .json({
                        success: false,
                        message:
                            "User is not authenticated",
                    });

                return;
            }

            if (!taskId) {
                response
                    .status(400)
                    .json({
                        success: false,
                        message:
                            "Invalid task ID",
                    });

                return;
            }

            const deleted =
                await deleteTaskRecord(
                    taskId,
                    userId
                );

            if (!deleted) {
                response
                    .status(404)
                    .json({
                        success: false,
                        message:
                            "Task not found",
                    });

                return;
            }

            response
                .status(200)
                .json({
                    success: true,
                    message:
                        "Task deleted successfully",
                });
        } catch (error) {
            console.error(
                "Delete task error:",
                error
            );

            response
                .status(500)
                .json({
                    success: false,
                    message:
                        "Unable to delete the task",
                });
        }
    };