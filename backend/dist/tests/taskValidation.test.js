"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const taskValidation_1 = require("../utils/taskValidation");
const getFutureDate = (daysToAdd = 2) => {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};
const getPastDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};
(0, vitest_1.describe)("Task validation", () => {
    (0, vitest_1.it)("accepts valid task data", () => {
        const result = (0, taskValidation_1.validateTaskInput)({
            title: "Complete assessment",
            description: "Finish the remaining work",
            priority: "High",
            status: "Pending",
            dueDate: getFutureDate(),
        });
        (0, vitest_1.expect)(result.isValid).toBe(true);
        (0, vitest_1.expect)(result.errors).toEqual({});
    });
    (0, vitest_1.it)("requires a task title", () => {
        const result = (0, taskValidation_1.validateTaskInput)({
            title: "",
            priority: "High",
            status: "Pending",
            dueDate: getFutureDate(),
        });
        (0, vitest_1.expect)(result.isValid).toBe(false);
        (0, vitest_1.expect)(result.errors.title).toBe("Title is required");
    });
    (0, vitest_1.it)("rejects titles over 200 characters", () => {
        const result = (0, taskValidation_1.validateTaskInput)({
            title: "a".repeat(201),
            priority: "High",
            status: "Pending",
            dueDate: getFutureDate(),
        });
        (0, vitest_1.expect)(result.isValid).toBe(false);
        (0, vitest_1.expect)(result.errors.title).toBe("Title cannot contain more than 200 characters");
    });
    (0, vitest_1.it)("rejects an invalid priority", () => {
        const result = (0, taskValidation_1.validateTaskInput)({
            title: "Test task",
            priority: "Urgent",
            status: "Pending",
            dueDate: getFutureDate(),
        });
        (0, vitest_1.expect)(result.isValid).toBe(false);
        (0, vitest_1.expect)(result.errors.priority).toBe("Priority must be Low, Medium, or High");
    });
    (0, vitest_1.it)("rejects an invalid status", () => {
        const result = (0, taskValidation_1.validateTaskInput)({
            title: "Test task",
            priority: "Medium",
            status: "Started",
            dueDate: getFutureDate(),
        });
        (0, vitest_1.expect)(result.isValid).toBe(false);
        (0, vitest_1.expect)(result.errors.status).toBe("Status must be Pending, In Progress, or Completed");
    });
    (0, vitest_1.it)("rejects an incorrectly formatted date", () => {
        const result = (0, taskValidation_1.validateTaskInput)({
            title: "Test task",
            priority: "Low",
            status: "Pending",
            dueDate: "20-07-2026",
        });
        (0, vitest_1.expect)(result.isValid).toBe(false);
        (0, vitest_1.expect)(result.errors.dueDate).toBe("Due date must use the YYYY-MM-DD format");
    });
    (0, vitest_1.it)("rejects a past due date", () => {
        const result = (0, taskValidation_1.validateTaskInput)({
            title: "Test task",
            priority: "Low",
            status: "Pending",
            dueDate: getPastDate(),
        });
        (0, vitest_1.expect)(result.isValid).toBe(false);
        (0, vitest_1.expect)(result.errors.dueDate).toBe("Due date cannot be earlier than today");
    });
    (0, vitest_1.it)("rejects a non-text description", () => {
        const result = (0, taskValidation_1.validateTaskInput)({
            title: "Test task",
            description: 123,
            priority: "Low",
            status: "Pending",
            dueDate: getFutureDate(),
        });
        (0, vitest_1.expect)(result.isValid).toBe(false);
        (0, vitest_1.expect)(result.errors.description).toBe("Description must be a text value");
    });
});
//# sourceMappingURL=taskValidation.test.js.map