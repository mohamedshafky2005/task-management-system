import {
    FiAlertCircle,
    FiCheckCircle,
    FiClock,
    FiList,
    FiRefreshCw,
} from "react-icons/fi";

import type {
    DashboardSummary,
} from "../types";

interface StatsCardsProps {
    summary: DashboardSummary;
}

interface StatCardItem {
    title: string;
    value: number;
    description: string;
    className: string;
    icon: React.ReactNode;
}

export default function StatsCards({
                                       summary,
                                   }: StatsCardsProps) {
    const cards: StatCardItem[] = [
        {
            title: "Total Tasks",
            value: summary.totalTasks,
            description:
                "All tasks in your workspace",
            className: "stat-card-total",
            icon: <FiList />,
        },
        {
            title: "Pending",
            value: summary.pendingTasks,
            description:
                "Tasks waiting to begin",
            className: "stat-card-pending",
            icon: <FiClock />,
        },
        {
            title: "In Progress",
            value: summary.inProgressTasks,
            description:
                "Tasks currently being worked on",
            className: "stat-card-progress",
            icon: <FiRefreshCw />,
        },
        {
            title: "Completed",
            value: summary.completedTasks,
            description:
                "Tasks successfully finished",
            className: "stat-card-completed",
            icon: <FiCheckCircle />,
        },
        {
            title: "Overdue",
            value: summary.overdueTasks,
            description:
                "Incomplete tasks past due date",
            className: "stat-card-overdue",
            icon: <FiAlertCircle />,
        },
    ];

    return (
        <section className="stats-grid">
            {cards.map((card) => (
                <article
                    className={`stat-card ${card.className}`}
                    key={card.title}
                >
                    <div className="stat-card-header">
                        <div className="stat-icon">
                            {card.icon}
                        </div>

                        <span className="stat-label">
              {card.title}
            </span>
                    </div>

                    <strong className="stat-value">
                        {card.value}
                    </strong>

                    <p>{card.description}</p>
                </article>
            ))}
        </section>
    );
}