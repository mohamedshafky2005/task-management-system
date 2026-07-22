import {
    FiAlertTriangle,
    FiTrash2,
    FiX,
} from "react-icons/fi";

import type {
    Task,
} from "../types";

interface DeleteModalProps {
    task: Task | null;
    isDeleting: boolean;
    error: string;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}

export default function DeleteModal({
                                        task,
                                        isDeleting,
                                        error,
                                        onClose,
                                        onConfirm,
                                    }: DeleteModalProps) {
    if (!task) {
        return null;
    }

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
                className="delete-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-modal-title"
            >
                <button
                    type="button"
                    className="modal-close-button delete-modal-close"
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    <FiX />
                </button>

                <div className="delete-warning-icon">
                    <FiAlertTriangle />
                </div>

                <h3 id="delete-modal-title">
                    Delete this task?
                </h3>

                <p>
                    You are about to delete{" "}
                    <strong>
                        “{task.title}”
                    </strong>
                    . This action cannot be undone.
                </p>

                {error && (
                    <div className="modal-error">
                        {error}
                    </div>
                )}

                <div className="delete-modal-actions">
                    <button
                        type="button"
                        className="cancel-button"
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="confirm-delete-button"
                        onClick={() =>
                            void onConfirm()
                        }
                        disabled={isDeleting}
                    >
                        <FiTrash2 />

                        {isDeleting
                            ? "Deleting..."
                            : "Delete Task"}
                    </button>
                </div>
            </section>
        </div>
    );
}