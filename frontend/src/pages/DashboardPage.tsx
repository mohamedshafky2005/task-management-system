import {
    useCallback,
    useEffect,
    useState,
} from "react";

import type {
    AxiosError,
} from "axios";

import {
    FiPlus,
    FiRefreshCw,
} from "react-icons/fi";

import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import StatsCards from "../components/StatsCards";
import Loader from "../components/Loader";
import SearchFilters from "../components/SearchFilters";
import TaskTable from "../components/TaskTable";
import TaskModal from "../components/TaskModal";
import DeleteModal from "../components/DeleteModal";
import Pagination from "../components/Pagination";

import {
    fetchDashboardSummary,
} from "../services/dashboardService";

import {
    createTask,
    deleteTask,
    fetchTasks,
    updateTask,
} from "../services/taskService";

import {
    useAuth,
} from "../context/AuthContext";

import type {
    DashboardSummary,
    PaginationMeta,
    Task,
    TaskFormData,
} from "../types";

interface ErrorResponse {
    message?: string;
    errors?: Record<
        string,
        string
    >;
}

const initialSummary:
    DashboardSummary = {
    totalTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
};

const initialPagination:
    PaginationMeta = {
    page: 1,
    limit: 5,
    totalItems: 0,
    totalPages: 0,
};

export default function DashboardPage() {
    const { user } = useAuth();

    const [summary, setSummary] =
        useState<DashboardSummary>(
            initialSummary
        );

    const [tasks, setTasks] =
        useState<Task[]>([]);

    const [
        pagination,
        setPagination,
    ] =
        useState<PaginationMeta>(
            initialPagination
        );

    const [search, setSearch] =
        useState("");

    const [status, setStatus] =
        useState("");

    const [priority, setPriority] =
        useState("");

    const [sort, setSort] =
        useState("newest");

    const [page, setPage] =
        useState(1);

    const [limit, setLimit] =
        useState(5);

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);

    const [
        isTasksLoading,
        setIsTasksLoading,
    ] = useState(false);

    const [error, setError] =
        useState("");

    const [
        taskModalOpen,
        setTaskModalOpen,
    ] = useState(false);

    const [
        editingTask,
        setEditingTask,
    ] =
        useState<Task | null>(
            null
        );

    const [
        isSubmitting,
        setIsSubmitting,
    ] = useState(false);

    const [
        formError,
        setFormError,
    ] = useState("");

    const [
        taskToDelete,
        setTaskToDelete,
    ] =
        useState<Task | null>(
            null
        );

    const [
        isDeleting,
        setIsDeleting,
    ] = useState(false);

    const [
        deleteError,
        setDeleteError,
    ] = useState("");

    const loadDashboard =
        useCallback(
            async (): Promise<void> => {
                const dashboardSummary =
                    await fetchDashboardSummary();

                setSummary(
                    dashboardSummary
                );
            },
            []
        );

    const loadTasks =
        useCallback(
            async (): Promise<void> => {
                try {
                    setIsTasksLoading(true);
                    setError("");

                    const result =
                        await fetchTasks({
                            search,
                            status,
                            priority,
                            sort,
                            page,
                            limit,
                        });

                    setTasks(result.tasks);

                    setPagination(
                        result.pagination
                    );

                    if (
                        result.pagination.page !==
                        page
                    ) {
                        setPage(
                            result.pagination.page
                        );
                    }
                } catch (error) {
                    const axiosError =
                        error as AxiosError<ErrorResponse>;

                    const message =
                        axiosError.response
                            ?.data?.message ||
                        "Unable to load tasks";

                    setError(message);
                } finally {
                    setIsTasksLoading(
                        false
                    );
                }
            },
            [
                search,
                status,
                priority,
                sort,
                page,
                limit,
            ]
        );

    useEffect(() => {
        const loadInitialData =
            async (): Promise<void> => {
                try {
                    setIsLoading(true);
                    setError("");

                    const [
                        dashboardSummary,
                        taskResult,
                    ] =
                        await Promise.all([
                            fetchDashboardSummary(),

                            fetchTasks({
                                search: "",
                                status: "",
                                priority: "",
                                sort: "newest",
                                page: 1,
                                limit: 5,
                            }),
                        ]);

                    setSummary(
                        dashboardSummary
                    );

                    setTasks(
                        taskResult.tasks
                    );

                    setPagination(
                        taskResult.pagination
                    );

                    setPage(
                        taskResult.pagination
                            .page
                    );

                    setLimit(
                        taskResult.pagination
                            .limit
                    );
                } catch (error) {
                    const axiosError =
                        error as AxiosError<ErrorResponse>;

                    const message =
                        axiosError.response
                            ?.data?.message ||
                        "Unable to load dashboard data";

                    setError(message);

                    toast.error(message);
                } finally {
                    setIsLoading(false);
                }
            };

        void loadInitialData();
    }, []);

    useEffect(() => {
        if (isLoading) {
            return;
        }

        const timeoutId =
            window.setTimeout(() => {
                void loadTasks();
            }, 400);

        return () => {
            window.clearTimeout(
                timeoutId
            );
        };
    }, [
        loadTasks,
        isLoading,
    ]);

    useEffect(() => {
        setPage(1);
    }, [
        search,
        status,
        priority,
        sort,
        limit,
    ]);

    const refreshAll =
        async (
            showToast = false
        ): Promise<void> => {
            try {
                setError("");

                await Promise.all([
                    loadDashboard(),
                    loadTasks(),
                ]);

                if (showToast) {
                    toast.success(
                        "Data refreshed successfully"
                    );
                }
            } catch (error) {
                const axiosError =
                    error as AxiosError<ErrorResponse>;

                const message =
                    axiosError.response
                        ?.data?.message ||
                    "Unable to refresh data";

                setError(message);

                toast.error(message);
            }
        };

    const openCreateModal =
        (): void => {
            setEditingTask(null);
            setFormError("");
            setTaskModalOpen(true);
        };

    const openEditModal = (
        task: Task
    ): void => {
        setEditingTask(task);
        setFormError("");
        setTaskModalOpen(true);
    };

    const closeTaskModal =
        (): void => {
            if (isSubmitting) {
                return;
            }

            setTaskModalOpen(
                false
            );

            setEditingTask(null);

            setFormError("");
        };

    const handleTaskSubmit =
        async (
            formData: TaskFormData
        ): Promise<void> => {
            try {
                setIsSubmitting(true);
                setFormError("");

                if (editingTask) {
                    await updateTask(
                        editingTask.id,
                        formData
                    );

                    toast.success(
                        "Task updated successfully"
                    );
                } else {
                    await createTask(
                        formData
                    );

                    toast.success(
                        "Task created successfully"
                    );
                }

                setTaskModalOpen(
                    false
                );

                setEditingTask(null);

                setPage(1);

                await Promise.all([
                    loadDashboard(),
                    fetchTasks({
                        search,
                        status,
                        priority,
                        sort,
                        page: 1,
                        limit,
                    }).then(
                        (result) => {
                            setTasks(
                                result.tasks
                            );

                            setPagination(
                                result.pagination
                            );
                        }
                    ),
                ]);
            } catch (error) {
                const axiosError =
                    error as AxiosError<ErrorResponse>;

                const backendErrors =
                    axiosError.response
                        ?.data?.errors;

                const firstValidationError =
                    backendErrors
                        ? Object.values(
                            backendErrors
                        )[0]
                        : undefined;

                const message =
                    firstValidationError ||
                    axiosError.response
                        ?.data?.message ||
                    "Unable to save the task";

                setFormError(message);

                toast.error(message);
            } finally {
                setIsSubmitting(
                    false
                );
            }
        };

    const openDeleteModal = (
        task: Task
    ): void => {
        setTaskToDelete(task);
        setDeleteError("");
    };

    const closeDeleteModal =
        (): void => {
            if (isDeleting) {
                return;
            }

            setTaskToDelete(null);

            setDeleteError("");
        };

    const handleDelete =
        async (): Promise<void> => {
            if (!taskToDelete) {
                return;
            }

            try {
                setIsDeleting(true);
                setDeleteError("");

                await deleteTask(
                    taskToDelete.id
                );

                toast.success(
                    "Task deleted successfully"
                );

                setTaskToDelete(null);

                const newPage =
                    tasks.length === 1 &&
                    page > 1
                        ? page - 1
                        : page;

                setPage(newPage);

                const [
                    dashboardSummary,
                    taskResult,
                ] =
                    await Promise.all([
                        fetchDashboardSummary(),

                        fetchTasks({
                            search,
                            status,
                            priority,
                            sort,
                            page: newPage,
                            limit,
                        }),
                    ]);

                setSummary(
                    dashboardSummary
                );

                setTasks(
                    taskResult.tasks
                );

                setPagination(
                    taskResult.pagination
                );
            } catch (error) {
                const axiosError =
                    error as AxiosError<ErrorResponse>;

                const message =
                    axiosError.response
                        ?.data?.message ||
                    "Unable to delete the task";

                setDeleteError(
                    message
                );

                toast.error(message);
            } finally {
                setIsDeleting(false);
            }
        };

    return (
        <div className="dashboard-page">
            <Navbar />

            <main className="dashboard-main">
                <section className="welcome-section">
                    <div>
            <span className="welcome-label">
              Dashboard overview
            </span>

                        <h2>
                            Welcome back,{" "}
                            {user?.name ||
                                "Administrator"}
                        </h2>

                        <p>
                            Organize your tasks,
                            monitor progress, and
                            stay focused on what
                            matters most.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="add-task-button"
                        onClick={
                            openCreateModal
                        }
                    >
                        <FiPlus />

                        Add New Task
                    </button>
                </section>

                {error && (
                    <div className="dashboard-error">
                        <div>
                            <strong>
                                Something went wrong
                            </strong>

                            <span>
                {error}
              </span>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                void refreshAll(
                                    true
                                )
                            }
                        >
                            <FiRefreshCw />

                            Retry
                        </button>
                    </div>
                )}

                {isLoading ? (
                    <Loader />
                ) : (
                    <>
                        <StatsCards
                            summary={summary}
                        />

                        <section className="task-section">
                            <div className="task-section-header">
                                <div>
                                    <h3>
                                        Your Tasks
                                    </h3>

                                    <p>
                                        Search, filter,
                                        create, and manage
                                        your daily tasks.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={() =>
                                        void refreshAll(
                                            true
                                        )
                                    }
                                >
                                    <FiRefreshCw />

                                    Refresh
                                </button>
                            </div>

                            <SearchFilters
                                search={search}
                                status={status}
                                priority={
                                    priority
                                }
                                sort={sort}
                                onSearchChange={
                                    setSearch
                                }
                                onStatusChange={
                                    setStatus
                                }
                                onPriorityChange={
                                    setPriority
                                }
                                onSortChange={
                                    setSort
                                }
                            />

                            {isTasksLoading ? (
                                <div className="task-list-loader">
                                    <div className="loader" />

                                    <p>
                                        Loading tasks...
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <TaskTable
                                        tasks={tasks}
                                        onEdit={
                                            openEditModal
                                        }
                                        onDelete={
                                            openDeleteModal
                                        }
                                    />

                                    <Pagination
                                        currentPage={
                                            pagination.page
                                        }
                                        totalPages={
                                            pagination.totalPages
                                        }
                                        totalItems={
                                            pagination.totalItems
                                        }
                                        limit={
                                            pagination.limit
                                        }
                                        onPageChange={
                                            setPage
                                        }
                                        onLimitChange={(
                                            newLimit
                                        ) => {
                                            setLimit(
                                                newLimit
                                            );

                                            setPage(1);
                                        }}
                                    />
                                </>
                            )}
                        </section>
                    </>
                )}
            </main>

            <TaskModal
                isOpen={
                    taskModalOpen
                }
                task={editingTask}
                isSubmitting={
                    isSubmitting
                }
                serverError={
                    formError
                }
                onClose={
                    closeTaskModal
                }
                onSubmit={
                    handleTaskSubmit
                }
            />

            <DeleteModal
                task={
                    taskToDelete
                }
                isDeleting={
                    isDeleting
                }
                error={
                    deleteError
                }
                onClose={
                    closeDeleteModal
                }
                onConfirm={
                    handleDelete
                }
            />
        </div>
    );
}