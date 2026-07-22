import {
    FiChevronLeft,
    FiChevronRight,
} from "react-icons/fi";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;

    onPageChange: (
        page: number
    ) => void;

    onLimitChange: (
        limit: number
    ) => void;
}

export default function Pagination({
                                       currentPage,
                                       totalPages,
                                       totalItems,
                                       limit,
                                       onPageChange,
                                       onLimitChange,
                                   }: PaginationProps) {
    if (totalItems === 0) {
        return null;
    }

    const firstItem =
        (currentPage - 1) *
        limit +
        1;

    const lastItem = Math.min(
        currentPage * limit,
        totalItems
    );

    return (
        <div className="pagination">
            <div className="pagination-summary">
        <span>
          Showing {firstItem}–
            {lastItem} of{" "}
            {totalItems} tasks
        </span>
            </div>

            <div className="pagination-controls">
                <label>
                    Rows per page

                    <select
                        value={limit}
                        onChange={(event) =>
                            onLimitChange(
                                Number(
                                    event.target.value
                                )
                            )
                        }
                    >
                        <option value={5}>
                            5
                        </option>

                        <option value={10}>
                            10
                        </option>

                        <option value={20}>
                            20
                        </option>
                    </select>
                </label>

                <span className="pagination-page">
          Page {currentPage} of{" "}
                    {Math.max(
                        totalPages,
                        1
                    )}
        </span>

                <button
                    type="button"
                    onClick={() =>
                        onPageChange(
                            currentPage - 1
                        )
                    }
                    disabled={
                        currentPage <= 1
                    }
                    aria-label="Previous page"
                >
                    <FiChevronLeft />
                    Previous
                </button>

                <button
                    type="button"
                    onClick={() =>
                        onPageChange(
                            currentPage + 1
                        )
                    }
                    disabled={
                        currentPage >=
                        totalPages
                    }
                    aria-label="Next page"
                >
                    Next
                    <FiChevronRight />
                </button>
            </div>
        </div>
    );
}