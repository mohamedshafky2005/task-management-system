"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.getTaskById = exports.getAllTasks = exports.createTask = void 0;
const taskService_1 = require("../services/taskService");
const taskValidation_1 = require("../utils/taskValidation");
const allowedStatuses = [
    "Pending",
    "In Progress",
    "Completed",
];
const allowedPriorities = [
    "Low",
    "Medium",
    "High",
];
const allowedSortValues = [
    "newest",
    "oldest",
    "dueDate",
];
const getAuthenticatedUserId = (request) => {
    return (request.user?.userId ?? null);
};
const parseTaskId = (value) => {
    if (!value ||
        Array.isArray(value)) {
        return null;
    }
    const taskId = Number(value);
    if (!Number.isInteger(taskId) ||
        taskId <= 0) {
        return null;
    }
    return taskId;
};
const createTask = async (request, response) => {
    try {
        const userId = getAuthenticatedUserId(request);
        if (!userId) {
            response
                .status(401)
                .json({
                success: false,
                message: "User is not authenticated",
            });
            return;
        }
        const validation = (0, taskValidation_1.validateTaskInput)(request.body);
        if (!validation.isValid) {
            response
                .status(400)
                .json({
                success: false,
                message: "Validation failed",
                errors: validation.errors,
            });
            return;
        }
        const { title, description, priority, status, dueDate, } = request.body;
        const task = await (0, taskService_1.createTaskRecord)({
            userId,
            title: String(title).trim(),
            description: typeof description ===
                "string"
                ? description.trim()
                : null,
            priority: priority,
            status: status,
            dueDate: String(dueDate),
        });
        response
            .status(201)
            .json({
            success: true,
            message: "Task created successfully",
            data: task,
        });
    }
    catch (error) {
        console.error("Create task error:", error);
        response
            .status(500)
            .json({
            success: false,
            message: "Unable to create the task",
        });
    }
};
exports.createTask = createTask;
const getAllTasks = async (request, response) => {
    try {
        const userId = getAuthenticatedUserId(request);
        if (!userId) {
            response
                .status(401)
                .json({
                success: false,
                message: "User is not authenticated",
            });
            return;
        }
        const search = typeof request.query
            .search === "string"
            ? request.query.search.trim()
            : undefined;
        const status = typeof request.query
            .status === "string"
            ? request.query.status
            : undefined;
        const priority = typeof request.query
            .priority === "string"
            ? request.query.priority
            : undefined;
        const sort = typeof request.query
            .sort === "string"
            ? request.query.sort
            : "newest";
        const page = typeof request.query
            .page === "string"
            ? Number(request.query.page)
            : 1;
        const limit = typeof request.query
            .limit === "string"
            ? Number(request.query.limit)
            : 5;
        if (status &&
            !allowedStatuses.includes(status)) {
            response
                .status(400)
                .json({
                success: false,
                message: "Invalid status filter",
            });
            return;
        }
        if (priority &&
            !allowedPriorities.includes(priority)) {
            response
                .status(400)
                .json({
                success: false,
                message: "Invalid priority filter",
            });
            return;
        }
        if (sort &&
            !allowedSortValues.includes(sort)) {
            response
                .status(400)
                .json({
                success: false,
                message: "Invalid sorting option",
            });
            return;
        }
        if (!Number.isInteger(page) ||
            page <= 0) {
            response
                .status(400)
                .json({
                success: false,
                message: "Page must be a positive integer",
            });
            return;
        }
        if (!Number.isInteger(limit) ||
            limit <= 0 ||
            limit > 100) {
            response
                .status(400)
                .json({
                success: false,
                message: "Limit must be between 1 and 100",
            });
            return;
        }
        const result = await (0, taskService_1.getTasksForUser)(userId, {
            search,
            status,
            priority,
            sort,
            page,
            limit,
        });
        response
            .status(200)
            .json({
            success: true,
            data: result.tasks,
            pagination: {
                page: result.page,
                limit: result.limit,
                totalItems: result.totalItems,
                totalPages: result.totalPages,
            },
        });
    }
    catch (error) {
        console.error("Get tasks error:", error);
        response
            .status(500)
            .json({
            success: false,
            message: "Unable to retrieve tasks",
        });
    }
};
exports.getAllTasks = getAllTasks;
const getTaskById = async (request, response) => {
    try {
        const userId = getAuthenticatedUserId(request);
        const taskId = parseTaskId(request.params.id);
        if (!userId) {
            response
                .status(401)
                .json({
                success: false,
                message: "User is not authenticated",
            });
            return;
        }
        if (!taskId) {
            response
                .status(400)
                .json({
                success: false,
                message: "Invalid task ID",
            });
            return;
        }
        const task = await (0, taskService_1.getTaskByIdForUser)(taskId, userId);
        if (!task) {
            response
                .status(404)
                .json({
                success: false,
                message: "Task not found",
            });
            return;
        }
        response
            .status(200)
            .json({
            success: true,
            data: task,
        });
    }
    catch (error) {
        console.error("Get task error:", error);
        response
            .status(500)
            .json({
            success: false,
            message: "Unable to retrieve the task",
        });
    }
};
exports.getTaskById = getTaskById;
const updateTask = async (request, response) => {
    try {
        const userId = getAuthenticatedUserId(request);
        const taskId = parseTaskId(request.params.id);
        if (!userId) {
            response
                .status(401)
                .json({
                success: false,
                message: "User is not authenticated",
            });
            return;
        }
        if (!taskId) {
            response
                .status(400)
                .json({
                success: false,
                message: "Invalid task ID",
            });
            return;
        }
        const existingTask = await (0, taskService_1.getTaskByIdForUser)(taskId, userId);
        if (!existingTask) {
            response
                .status(404)
                .json({
                success: false,
                message: "Task not found",
            });
            return;
        }
        const validation = (0, taskValidation_1.validateTaskInput)(request.body);
        if (!validation.isValid) {
            response
                .status(400)
                .json({
                success: false,
                message: "Validation failed",
                errors: validation.errors,
            });
            return;
        }
        const { title, description, priority, status, dueDate, } = request.body;
        const updatedTask = await (0, taskService_1.updateTaskRecord)(taskId, userId, {
            title: String(title).trim(),
            description: typeof description ===
                "string"
                ? description.trim()
                : null,
            priority: priority,
            status: status,
            dueDate: String(dueDate),
        });
        response
            .status(200)
            .json({
            success: true,
            message: "Task updated successfully",
            data: updatedTask,
        });
    }
    catch (error) {
        console.error("Update task error:", error);
        response
            .status(500)
            .json({
            success: false,
            message: "Unable to update the task",
        });
    }
};
exports.updateTask = updateTask;
const deleteTask = async (request, response) => {
    try {
        const userId = getAuthenticatedUserId(request);
        const taskId = parseTaskId(request.params.id);
        if (!userId) {
            response
                .status(401)
                .json({
                success: false,
                message: "User is not authenticated",
            });
            return;
        }
        if (!taskId) {
            response
                .status(400)
                .json({
                success: false,
                message: "Invalid task ID",
            });
            return;
        }
        const deleted = await (0, taskService_1.deleteTaskRecord)(taskId, userId);
        if (!deleted) {
            response
                .status(404)
                .json({
                success: false,
                message: "Task not found",
            });
            return;
        }
        response
            .status(200)
            .json({
            success: true,
            message: "Task deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete task error:", error);
        response
            .status(500)
            .json({
            success: false,
            message: "Unable to delete the task",
        });
    }
};
exports.deleteTask = deleteTask;
