import {
    FiFilter,
    FiSearch,
} from "react-icons/fi";

interface SearchFiltersProps {
    search: string;
    status: string;
    priority: string;
    sort: string;
    onSearchChange: (
        value: string
    ) => void;
    onStatusChange: (
        value: string
    ) => void;
    onPriorityChange: (
        value: string
    ) => void;
    onSortChange: (
        value: string
    ) => void;
}

export default function SearchFilters({
                                          search,
                                          status,
                                          priority,
                                          sort,
                                          onSearchChange,
                                          onStatusChange,
                                          onPriorityChange,
                                          onSortChange,
                                      }: SearchFiltersProps) {
    return (
        <div className="task-toolbar">
            <div className="search-input-wrapper">
                <FiSearch />

                <input
                    type="search"
                    value={search}
                    onChange={(event) =>
                        onSearchChange(
                            event.target.value
                        )
                    }
                    placeholder="Search by task title..."
                />
            </div>

            <div className="filter-controls">
                <div className="filter-label">
                    <FiFilter />
                    Filters
                </div>

                <select
                    value={status}
                    onChange={(event) =>
                        onStatusChange(
                            event.target.value
                        )
                    }
                    aria-label="Filter by status"
                >
                    <option value="">
                        All statuses
                    </option>

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

                <select
                    value={priority}
                    onChange={(event) =>
                        onPriorityChange(
                            event.target.value
                        )
                    }
                    aria-label="Filter by priority"
                >
                    <option value="">
                        All priorities
                    </option>

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

                <select
                    value={sort}
                    onChange={(event) =>
                        onSortChange(
                            event.target.value
                        )
                    }
                    aria-label="Sort tasks"
                >
                    <option value="newest">
                        Newest created
                    </option>

                    <option value="oldest">
                        Oldest created
                    </option>

                    <option value="dueDate">
                        Due date
                    </option>
                </select>
            </div>
        </div>
    );
}