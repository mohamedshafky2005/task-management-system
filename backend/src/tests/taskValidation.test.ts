import {
    describe,
    expect,
    it,
} from "vitest";

import {
    validateTaskInput,
} from "../utils/taskValidation";

const getFutureDate = (
    daysToAdd = 2
): string => {
    const date = new Date();

    date.setDate(
        date.getDate() + daysToAdd
    );

    const year =
        date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const getPastDate = (): string => {
    const date = new Date();

    date.setDate(
        date.getDate() - 1
    );

    const year =
        date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

describe("Task validation", () => {
    it("accepts valid task data", () => {
        const result =
            validateTaskInput({
                title: "Complete assessment",
                description:
                    "Finish the remaining work",
                priority: "High",
                status: "Pending",
                dueDate: getFutureDate(),
            });

        expect(result.isValid).toBe(true);
        expect(result.errors).toEqual({});
    });

    it("requires a task title", () => {
        const result =
            validateTaskInput({
                title: "",
                priority: "High",
                status: "Pending",
                dueDate: getFutureDate(),
            });

        expect(result.isValid).toBe(false);

        expect(result.errors.title).toBe(
            "Title is required"
        );
    });

    it("rejects titles over 200 characters", () => {
        const result =
            validateTaskInput({
                title: "a".repeat(201),
                priority: "High",
                status: "Pending",
                dueDate: getFutureDate(),
            });

        expect(result.isValid).toBe(false);

        expect(result.errors.title).toBe(
            "Title cannot contain more than 200 characters"
        );
    });

    it("rejects an invalid priority", () => {
        const result =
            validateTaskInput({
                title: "Test task",
                priority: "Urgent",
                status: "Pending",
                dueDate: getFutureDate(),
            });

        expect(result.isValid).toBe(false);

        expect(result.errors.priority).toBe(
            "Priority must be Low, Medium, or High"
        );
    });

    it("rejects an invalid status", () => {
        const result =
            validateTaskInput({
                title: "Test task",
                priority: "Medium",
                status: "Started",
                dueDate: getFutureDate(),
            });

        expect(result.isValid).toBe(false);

        expect(result.errors.status).toBe(
            "Status must be Pending, In Progress, or Completed"
        );
    });

    it("rejects an incorrectly formatted date", () => {
        const result =
            validateTaskInput({
                title: "Test task",
                priority: "Low",
                status: "Pending",
                dueDate: "20-07-2026",
            });

        expect(result.isValid).toBe(false);

        expect(result.errors.dueDate).toBe(
            "Due date must use the YYYY-MM-DD format"
        );
    });

    it("rejects a past due date", () => {
        const result =
            validateTaskInput({
                title: "Test task",
                priority: "Low",
                status: "Pending",
                dueDate: getPastDate(),
            });

        expect(result.isValid).toBe(false);

        expect(result.errors.dueDate).toBe(
            "Due date cannot be earlier than today"
        );
    });

    it("rejects a non-text description", () => {
        const result =
            validateTaskInput({
                title: "Test task",
                description: 123,
                priority: "Low",
                status: "Pending",
                dueDate: getFutureDate(),
            });

        expect(result.isValid).toBe(false);

        expect(
            result.errors.description
        ).toBe(
            "Description must be a text value"
        );
    });
});