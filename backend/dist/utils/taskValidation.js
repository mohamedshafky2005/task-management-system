"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTaskInput = void 0;
const validPriorities = ["Low", "Medium", "High"];
const validStatuses = [
    "Pending",
    "In Progress",
    "Completed",
];
const isValidDateString = (value) => {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(value)) {
        return false;
    }
    const date = new Date(`${value}T00:00:00`);
    return !Number.isNaN(date.getTime());
};
const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};
const validateTaskInput = (input) => {
    const errors = {};
    const title = typeof input.title === "string"
        ? input.title.trim()
        : "";
    const priority = typeof input.priority === "string"
        ? input.priority
        : "";
    const status = typeof input.status === "string"
        ? input.status
        : "";
    const dueDate = typeof input.dueDate === "string"
        ? input.dueDate
        : "";
    if (!title) {
        errors.title = "Title is required";
    }
    else if (title.length > 200) {
        errors.title =
            "Title cannot contain more than 200 characters";
    }
    if (input.description !== undefined &&
        input.description !== null &&
        typeof input.description !== "string") {
        errors.description =
            "Description must be a text value";
    }
    if (!priority) {
        errors.priority = "Priority is required";
    }
    else if (!validPriorities.includes(priority)) {
        errors.priority =
            "Priority must be Low, Medium, or High";
    }
    if (!status) {
        errors.status = "Status is required";
    }
    else if (!validStatuses.includes(status)) {
        errors.status =
            "Status must be Pending, In Progress, or Completed";
    }
    if (!dueDate) {
        errors.dueDate = "Due date is required";
    }
    else if (!isValidDateString(dueDate)) {
        errors.dueDate =
            "Due date must use the YYYY-MM-DD format";
    }
    else if (dueDate < getTodayDateString()) {
        errors.dueDate =
            "Due date cannot be earlier than today";
    }
    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};
exports.validateTaskInput = validateTaskInput;
