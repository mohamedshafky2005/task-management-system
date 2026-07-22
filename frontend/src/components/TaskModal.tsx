import {
    useEffect,
    useState,
} from "react";

import type {
    FormEvent,
} from "react";

import {
    FiCheck,
    FiX,
} from "react-icons/fi";

import type {
    Task,
    TaskFormData,
} from "../types";

interface TaskModalProps {
    isOpen: boolean;
    task: Task | null;
    isSubmitting: boolean;
    serverError: string;
    onClose: () => void;
    onSubmit: (
        formData: TaskFormData
    ) => Promise<void>;
}

interface FormErrors {
    title?: string;
    priority?: string;
    status?: string;
    dueDate?: string;
}

const getToday = (): string => {
    const date = new Date();

    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const initialFormData: TaskFormData = {
    title: "",
    description: "",
    priority: "Medium",
    status: "Pending",
    dueDate: getToday(),
};

export default function TaskModal({
                                      isOpen,
                                      task,
                                      isSubmitting,
                                      serverError,
                                      onClose,
                                      onSubmit,
                                  }: TaskModalProps) {
    const [formData, setFormData] =
        useState<TaskFormData>(
            initialFormData
        );

    const [errors, setErrors] =
        useState<FormErrors>({});

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        if (task) {
            setFormData({
                title: task.title,
                description:
                    task.description || "",
                priority: task.priority,
                status: task.status,
                dueDate:
                    task.due_date.substring(
                        0,
                        10
                    ),
            });
        } else {
            setFormData({
                ...initialFormData,
                dueDate: getToday(),
            });
        }

        setErrors({});
    }, [isOpen, task]);

    if (!isOpen) {
        return null;
    }

    const validateForm =
        (): boolean => {
            const validationErrors:
                FormErrors = {};

            if (!formData.title.trim()) {
                validationErrors.title =
                    "Title is required";
            }

            if (!formData.priority) {
                validationErrors.priority =
                    "Priority is required";
            }

            if (!formData.status) {
                validationErrors.status =
                    "Status is required";
            }

            if (!formData.dueDate) {
                validationErrors.dueDate =
                    "Due date is required";
            } else if (
                formData.dueDate < getToday()
            ) {
                validationErrors.dueDate =
                    "Due date cannot be earlier than today";
            }

            setErrors(validationErrors);

            return (
                Object.keys(
                    validationErrors
                ).length === 0
            );
        };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ): Promise<void> => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        await onSubmit({
            ...formData,
            title: formData.title.trim(),
            description:
                formData.description.trim(),
        });
    };

    return (
        <div
            className="modal-backdrop"
            role="presentation"
            onMouseDown={(event) => {
                if (
                    event.target ===
                    event.currentTarget
                ) {
                    onClose();
                }
            }}
        >
            <section
                className="task-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="task-modal-title"
            >
                <header className="modal-header">
                    <div>
            <span className="modal-label">
              Task details
            </span>

                        <h3 id="task-modal-title">
                            {task
                                ? "Edit Task"
                                : "Create New Task"}
                        </h3>

                        <p>
                            {task
                                ? "Update the details of your task."
                                : "Add a new task to your workspace."}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="modal-close-button"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        <FiX />
                    </button>
                </header>

                {serverError && (
                    <div className="modal-error">
                        {serverError}
                    </div>
                )}

                <form
                    className="task-form"
                    onSubmit={handleSubmit}
                >
                    <div className="form-group">
                        <label htmlFor="task-title">
                            Task title
                            <span>*</span>
                        </label>

                        <input
                            id="task-title"
                            type="text"
                            value={formData.title}
                            onChange={(event) =>
                                setFormData(
                                    (current) => ({
                                        ...current,
                                        title:
                                        event.target.value,
                                    })
                                )
                            }
                            placeholder="Enter task title"
                            maxLength={200}
                        />

                        {errors.title && (
                            <small className="field-error">
                                {errors.title}
                            </small>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="task-description">
                            Description
                        </label>

                        <textarea
                            id="task-description"
                            value={
                                formData.description
                            }
                            onChange={(event) =>
                                setFormData(
                                    (current) => ({
                                        ...current,
                                        description:
                                        event.target.value,
                                    })
                                )
                            }
                            placeholder="Describe your task"
                            rows={4}
                        />
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="task-priority">
                                Priority
                                <span>*</span>
                            </label>

                            <select
                                id="task-priority"
                                value={
                                    formData.priority
                                }
                                onChange={(event) =>
                                    setFormData(
                                        (current) => ({
                                            ...current,
                                            priority:
                                                event.target
                                                    .value as TaskFormData["priority"],
                                        })
                                    )
                                }
                            >
                                <option value="Low">
                                    Low
                                </option>

                                <option value="Medium">
                                    Medium
                                </option>

                                <option value="High">
                                    High
                                </option>
                            </select>

                            {errors.priority && (
                                <small className="field-error">
                                    {errors.priority}
                                </small>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="task-status">
                                Status
                                <span>*</span>
                            </label>

                            <select
                                id="task-status"
                                value={
                                    formData.status
                                }
                                onChange={(event) =>
                                    setFormData(
                                        (current) => ({
                                            ...current,
                                            status:
                                                event.target
                                                    .value as TaskFormData["status"],
                                        })
                                    )
                                }
                            >
                                <option value="Pending">
                                    Pending
                                </option>

                                <option value="In Progress">
                                    In Progress
                                </option>

                                <option value="Completed">
                                    Completed
                                </option>
                            </select>

                            {errors.status && (
                                <small className="field-error">
                                    {errors.status}
                                </small>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="task-due-date">
                            Due date
                            <span>*</span>
                        </label>

                        <input
                            id="task-due-date"
                            type="date"
                            min={getToday()}
                            value={formData.dueDate}
                            onChange={(event) =>
                                setFormData(
                                    (current) => ({
                                        ...current,
                                        dueDate:
                                        event.target.value,
                                    })
                                )
                            }
                        />

                        {errors.dueDate && (
                            <small className="field-error">
                                {errors.dueDate}
                            </small>
                        )}
                    </div>

                    <footer className="modal-footer">
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="save-task-button"
                            disabled={isSubmitting}
                        >
                            <FiCheck />

                            {isSubmitting
                                ? "Saving..."
                                : task
                                    ? "Update Task"
                                    : "Create Task"}
                        </button>
                    </footer>
                </form>
            </section>
        </div>
    );
}