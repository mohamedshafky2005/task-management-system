import api from "../api/api";

import type {
    PaginationMeta,
    Task,
    TaskFormData,
} from "../types";

interface TasksResponse {
    success: boolean;
    data: Task[];
    pagination: PaginationMeta;
}

interface TaskResponse {
    success: boolean;
    message: string;
    data: Task;
}

interface DeleteResponse {
    success: boolean;
    message: string;
}

export interface TaskQuery {
    search?: string;
    status?: string;
    priority?: string;
    sort?: string;
    page?: number;
    limit?: number;
}

export interface PaginatedTaskResult {
    tasks: Task[];
    pagination: PaginationMeta;
}

export const fetchTasks = async (
    query: TaskQuery
): Promise<PaginatedTaskResult> => {
    const response =
        await api.get<TasksResponse>(
            "/tasks",
            {
                params: {
                    search:
                        query.search ||
                        undefined,

                    status:
                        query.status ||
                        undefined,

                    priority:
                        query.priority ||
                        undefined,

                    sort:
                        query.sort ||
                        "newest",

                    page:
                        query.page || 1,

                    limit:
                        query.limit || 5,
                },
            }
        );

    return {
        tasks: response.data.data,
        pagination:
        response.data.pagination,
    };
};

export const createTask = async (
    taskData: TaskFormData
): Promise<Task> => {
    const response =
        await api.post<TaskResponse>(
            "/tasks",
            taskData
        );

    return response.data.data;
};

export const updateTask = async (
    taskId: number,
    taskData: TaskFormData
): Promise<Task> => {
    const response =
        await api.put<TaskResponse>(
            `/tasks/${taskId}`,
            taskData
        );

    return response.data.data;
};

export const deleteTask = async (
    taskId: number
): Promise<void> => {
    await api.delete<DeleteResponse>(
        `/tasks/${taskId}`
    );
};