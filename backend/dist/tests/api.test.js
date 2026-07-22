"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const vitest_1 = require("vitest");
vitest_1.vi.mock("../config/database", () => ({
    default: {
        execute: vitest_1.vi.fn(),
    },
}));
const app_1 = __importDefault(require("../app"));
const database_1 = __importDefault(require("../config/database"));
const mockedExecute = vitest_1.vi.mocked(database_1.default.execute);
const adminUser = {
    id: 1,
    name: "Administrator",
    email: "admin@test.com",
    password: bcryptjs_1.default.hashSync("123456", 10),
};
const createToken = () => {
    return jsonwebtoken_1.default.sign({
        userId: adminUser.id,
        email: adminUser.email,
    }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
};
(0, vitest_1.describe)("General API routes", () => {
    (0, vitest_1.beforeEach)(() => {
        mockedExecute.mockReset();
    });
    (0, vitest_1.it)("returns the API status", async () => {
        const response = await (0, supertest_1.default)(app_1.default).get("/");
        (0, vitest_1.expect)(response.status).toBe(200);
        (0, vitest_1.expect)(response.body).toEqual({
            success: true,
            message: "Task Management API is running",
        });
    });
    (0, vitest_1.it)("returns the health status", async () => {
        const response = await (0, supertest_1.default)(app_1.default).get("/api/health");
        (0, vitest_1.expect)(response.status).toBe(200);
        (0, vitest_1.expect)(response.body.success).toBe(true);
        (0, vitest_1.expect)(response.body.timestamp).toBeDefined();
    });
    (0, vitest_1.it)("returns 404 for an unknown route", async () => {
        const response = await (0, supertest_1.default)(app_1.default).get("/api/unknown");
        (0, vitest_1.expect)(response.status).toBe(404);
        (0, vitest_1.expect)(response.body).toEqual({
            success: false,
            message: "Route not found",
        });
    });
});
(0, vitest_1.describe)("Authentication API", () => {
    (0, vitest_1.beforeEach)(() => {
        mockedExecute.mockReset();
    });
    (0, vitest_1.it)("logs in with valid credentials", async () => {
        mockedExecute.mockResolvedValueOnce([
            [adminUser],
            [],
        ]);
        const response = await (0, supertest_1.default)(app_1.default)
            .post("/api/auth/login")
            .send({
            email: "admin@test.com",
            password: "123456",
        });
        (0, vitest_1.expect)(response.status).toBe(200);
        (0, vitest_1.expect)(response.body.success).toBe(true);
        (0, vitest_1.expect)(response.body.message).toBe("Login successful");
        (0, vitest_1.expect)(response.body.data.token).toBeDefined();
        (0, vitest_1.expect)(response.body.data.user).toEqual({
            id: 1,
            name: "Administrator",
            email: "admin@test.com",
        });
        (0, vitest_1.expect)(mockedExecute).toHaveBeenCalledOnce();
    });
    (0, vitest_1.it)("normalizes the email address", async () => {
        mockedExecute.mockResolvedValueOnce([
            [adminUser],
            [],
        ]);
        await (0, supertest_1.default)(app_1.default)
            .post("/api/auth/login")
            .send({
            email: "  ADMIN@TEST.COM  ",
            password: "123456",
        });
        (0, vitest_1.expect)(mockedExecute).toHaveBeenCalledWith(vitest_1.expect.any(String), ["admin@test.com"]);
    });
    (0, vitest_1.it)("rejects an incorrect password", async () => {
        mockedExecute.mockResolvedValueOnce([
            [adminUser],
            [],
        ]);
        const response = await (0, supertest_1.default)(app_1.default)
            .post("/api/auth/login")
            .send({
            email: "admin@test.com",
            password: "incorrect-password",
        });
        (0, vitest_1.expect)(response.status).toBe(401);
        (0, vitest_1.expect)(response.body).toEqual({
            success: false,
            message: "Invalid email or password",
        });
    });
    (0, vitest_1.it)("rejects an unknown email", async () => {
        mockedExecute.mockResolvedValueOnce([
            [],
            [],
        ]);
        const response = await (0, supertest_1.default)(app_1.default)
            .post("/api/auth/login")
            .send({
            email: "unknown@test.com",
            password: "123456",
        });
        (0, vitest_1.expect)(response.status).toBe(401);
        (0, vitest_1.expect)(response.body.message).toBe("Invalid email or password");
    });
    (0, vitest_1.it)("rejects missing credentials", async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .post("/api/auth/login")
            .send({});
        (0, vitest_1.expect)(response.status).toBe(400);
        (0, vitest_1.expect)(response.body).toEqual({
            success: false,
            message: "Email and password are required",
        });
        (0, vitest_1.expect)(mockedExecute).not.toHaveBeenCalled();
    });
});
(0, vitest_1.describe)("Authentication middleware", () => {
    (0, vitest_1.beforeEach)(() => {
        mockedExecute.mockReset();
    });
    (0, vitest_1.it)("rejects a task request without a token", async () => {
        const response = await (0, supertest_1.default)(app_1.default).get("/api/tasks");
        (0, vitest_1.expect)(response.status).toBe(401);
        (0, vitest_1.expect)(response.body).toEqual({
            success: false,
            message: "Authentication token is required",
        });
    });
    (0, vitest_1.it)("rejects an invalid token", async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .get("/api/tasks")
            .set("Authorization", "Bearer invalid-token");
        (0, vitest_1.expect)(response.status).toBe(401);
        (0, vitest_1.expect)(response.body).toEqual({
            success: false,
            message: "Invalid or expired authentication token",
        });
    });
});
(0, vitest_1.describe)("Task API", () => {
    (0, vitest_1.beforeEach)(() => {
        mockedExecute.mockReset();
    });
    (0, vitest_1.it)("returns paginated tasks", async () => {
        const token = createToken();
        mockedExecute
            .mockResolvedValueOnce([
            [
                {
                    total: 1,
                },
            ],
            [],
        ])
            .mockResolvedValueOnce([
            [
                {
                    id: 1,
                    user_id: 1,
                    title: "Test Task",
                    description: "Testing pagination",
                    priority: "High",
                    status: "Pending",
                    due_date: "2026-07-23",
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ],
            [],
        ]);
        const response = await (0, supertest_1.default)(app_1.default)
            .get("/api/tasks?page=1&limit=5")
            .set("Authorization", `Bearer ${token}`);
        (0, vitest_1.expect)(response.status).toBe(200);
        (0, vitest_1.expect)(response.body.success).toBe(true);
        (0, vitest_1.expect)(Array.isArray(response.body.data)).toBe(true);
        (0, vitest_1.expect)(response.body.data).toHaveLength(1);
        (0, vitest_1.expect)(response.body.pagination).toEqual({
            page: 1,
            limit: 5,
            totalItems: 1,
            totalPages: 1,
        });
    });
    (0, vitest_1.it)("rejects an invalid page number", async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .get("/api/tasks?page=0&limit=5")
            .set("Authorization", `Bearer ${createToken()}`);
        (0, vitest_1.expect)(response.status).toBe(400);
        (0, vitest_1.expect)(response.body.message).toBe("Page must be a positive integer");
    });
    (0, vitest_1.it)("rejects a limit over 100", async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .get("/api/tasks?page=1&limit=101")
            .set("Authorization", `Bearer ${createToken()}`);
        (0, vitest_1.expect)(response.status).toBe(400);
        (0, vitest_1.expect)(response.body.message).toBe("Limit must be between 1 and 100");
    });
    (0, vitest_1.it)("rejects invalid task creation data", async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .post("/api/tasks")
            .set("Authorization", `Bearer ${createToken()}`)
            .send({
            title: "",
            description: "",
            priority: "",
            status: "",
            dueDate: "",
        });
        (0, vitest_1.expect)(response.status).toBe(400);
        (0, vitest_1.expect)(response.body.success).toBe(false);
        (0, vitest_1.expect)(response.body.message).toBe("Validation failed");
        (0, vitest_1.expect)(response.body.errors.title).toBe("Title is required");
        (0, vitest_1.expect)(response.body.errors.priority).toBe("Priority is required");
        (0, vitest_1.expect)(response.body.errors.status).toBe("Status is required");
        (0, vitest_1.expect)(response.body.errors.dueDate).toBe("Due date is required");
    });
    (0, vitest_1.it)("returns 404 for a missing task", async () => {
        mockedExecute.mockResolvedValueOnce([
            [],
            [],
        ]);
        const response = await (0, supertest_1.default)(app_1.default)
            .get("/api/tasks/999")
            .set("Authorization", `Bearer ${createToken()}`);
        (0, vitest_1.expect)(response.status).toBe(404);
        (0, vitest_1.expect)(response.body.message).toBe("Task not found");
    });
});
(0, vitest_1.describe)("Dashboard API", () => {
    (0, vitest_1.beforeEach)(() => {
        mockedExecute.mockReset();
    });
    (0, vitest_1.it)("returns dashboard statistics", async () => {
        mockedExecute.mockResolvedValueOnce([
            [
                {
                    totalTasks: 10,
                    pendingTasks: 3,
                    inProgressTasks: 2,
                    completedTasks: 4,
                    overdueTasks: 1,
                },
            ],
            [],
        ]);
        const response = await (0, supertest_1.default)(app_1.default)
            .get("/api/dashboard/summary")
            .set("Authorization", `Bearer ${createToken()}`);
        (0, vitest_1.expect)(response.status).toBe(200);
        (0, vitest_1.expect)(response.body).toEqual({
            success: true,
            data: {
                totalTasks: 10,
                pendingTasks: 3,
                inProgressTasks: 2,
                completedTasks: 4,
                overdueTasks: 1,
            },
        });
    });
    (0, vitest_1.it)("protects the dashboard route", async () => {
        const response = await (0, supertest_1.default)(app_1.default).get("/api/dashboard/summary");
        (0, vitest_1.expect)(response.status).toBe(401);
        (0, vitest_1.expect)(response.body.message).toBe("Authentication token is required");
    });
});
