export interface User {
    id: number;
    name: string;
    email: string;
}

export type TaskPriority =
    | "Low"
    | "Medium"
    | "High";

export type TaskStatus =
    | "Pending"
    | "In Progress"
    | "Completed";

export interface Task {
    id: number;
    user_id: number;
    title: string;
    description: string | null;
    priority: TaskPriority;
    status: TaskStatus;
    due_date: string;
    created_at: string;
    updated_at: string;
}

export interface DashboardSummary {
    totalTasks: number;
    pendingTasks: number;
    inProgressTasks: number;
    completedTasks: number;
    overdueTasks: number;
}

export interface TaskFormData {
    title: string;
    description: string;
    priority: TaskPriority;
    status: TaskStatus;
    dueDate: string;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
}