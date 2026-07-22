import {
    FiCalendar,
    FiEdit2,
    FiInbox,
    FiTrash2,
} from "react-icons/fi";

import type {
    Task,
} from "../types";

interface TaskTableProps {
    tasks: Task[];
    onEdit: (
        task: Task
    ) => void;
    onDelete: (
        task: Task
    ) => void;
}

const formatDate = (
    dateValue: string
): string => {
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return dateValue;
    }

    return new Intl.DateTimeFormat(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    ).format(date);
};

const isOverdue = (
    task: Task
): boolean => {
    if (task.status === "Completed") {
        return false;
    }

    const dueDate = new Date(
        `${task.due_date.substring(
            0,
            10
        )}T23:59:59`
    );

    return dueDate < new Date();
};

export default function TaskTable({
                                      tasks,
                                      onEdit,
                                      onDelete,
                                  }: TaskTableProps) {
    if (tasks.length === 0) {
        return (
            <div className="empty-task-state">
                <div className="empty-task-icon">
                    <FiInbox />
                </div>

                <h4>No tasks found</h4>

                <p>
                    Create a new task or adjust your
                    search and filter options.
                </p>
            </div>
        );
    }

    return (
        <div className="task-table-wrapper">
            <table className="task-table">
                <thead>
                <tr>
                    <th>Task</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Due date</th>
                    <th>Updated</th>
                    <th className="actions-heading">
                        Actions
                    </th>
                </tr>
                </thead>

                <tbody>
                {tasks.map((task) => {
                    const overdue =
                        isOverdue(task);

                    return (
                        <tr key={task.id}>
                            <td>
                                <div className="task-title-cell">
                                    <strong>
                                        {task.title}
                                    </strong>

                                    <span>
                      {task.description ||
                          "No description"}
                    </span>
                                </div>
                            </td>

                            <td>
                  <span
                      className={`priority-badge priority-${task.priority.toLowerCase()}`}
                  >
                    {task.priority}
                  </span>
                            </td>

                            <td>
                  <span
                      className={`status-badge status-${task.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                  >
                    {task.status}
                  </span>
                            </td>

                            <td>
                                <div
                                    className={`date-cell ${
                                        overdue
                                            ? "date-overdue"
                                            : ""
                                    }`}
                                >
                                    <FiCalendar />

                                    <span>
                      {formatDate(
                          task.due_date
                      )}
                    </span>

                                    {overdue && (
                                        <small>
                                            Overdue
                                        </small>
                                    )}
                                </div>
                            </td>

                            <td>
                  <span className="updated-date">
                    {formatDate(
                        task.updated_at
                    )}
                  </span>
                            </td>

                            <td>
                                <div className="task-actions">
                                    <button
                                        type="button"
                                        className="icon-button edit-button"
                                        onClick={() =>
                                            onEdit(task)
                                        }
                                        aria-label={`Edit ${task.title}`}
                                        title="Edit task"
                                    >
                                        <FiEdit2 />
                                    </button>

                                    <button
                                        type="button"
                                        className="icon-button delete-button"
                                        onClick={() =>
                                            onDelete(task)
                                        }
                                        aria-label={`Delete ${task.title}`}
                                        title="Delete task"
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}