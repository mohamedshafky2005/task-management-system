import request from "supertest";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

vi.mock(
    "../config/database",
    () => ({
        default: {
            execute: vi.fn(),
        },
    })
);

import app from "../app";
import database from "../config/database";

const mockedExecute =
    vi.mocked(database.execute);

const adminUser = {
    id: 1,
    name: "Administrator",
    email: "admin@test.com",
    password: bcrypt.hashSync(
        "123456",
        10
    ),
};

const createToken = (): string => {
    return jwt.sign(
        {
            userId: adminUser.id,
            email: adminUser.email,
        },
        process.env.JWT_SECRET as string,
        {
            expiresIn: "1d",
        }
    );
};

describe("General API routes", () => {
    beforeEach(() => {
        mockedExecute.mockReset();
    });

    it("returns the API status", async () => {
        const response =
            await request(app).get("/");

        expect(response.status).toBe(200);

        expect(response.body).toEqual({
            success: true,
            message:
                "Task Management API is running",
        });
    });

    it("returns the health status", async () => {
        const response =
            await request(app).get(
                "/api/health"
            );

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(
            true
        );

        expect(
            response.body.timestamp
        ).toBeDefined();
    });

    it("returns 404 for an unknown route", async () => {
        const response =
            await request(app).get(
                "/api/unknown"
            );

        expect(response.status).toBe(404);

        expect(response.body).toEqual({
            success: false,
            message: "Route not found",
        });
    });
});

describe("Authentication API", () => {
    beforeEach(() => {
        mockedExecute.mockReset();
    });

    it("logs in with valid credentials", async () => {
        mockedExecute.mockResolvedValueOnce(
            [
                [adminUser],
                [],
            ] as never
        );

        const response =
            await request(app)
                .post("/api/auth/login")
                .send({
                    email: "admin@test.com",
                    password: "123456",
                });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(
            true
        );

        expect(response.body.message).toBe(
            "Login successful"
        );

        expect(
            response.body.data.token
        ).toBeDefined();

        expect(
            response.body.data.user
        ).toEqual({
            id: 1,
            name: "Administrator",
            email: "admin@test.com",
        });

        expect(
            mockedExecute
        ).toHaveBeenCalledOnce();
    });

    it("normalizes the email address", async () => {
        mockedExecute.mockResolvedValueOnce(
            [
                [adminUser],
                [],
            ] as never
        );

        await request(app)
            .post("/api/auth/login")
            .send({
                email:
                    "  ADMIN@TEST.COM  ",
                password: "123456",
            });

        expect(
            mockedExecute
        ).toHaveBeenCalledWith(
            expect.any(String),
            ["admin@test.com"]
        );
    });

    it("rejects an incorrect password", async () => {
        mockedExecute.mockResolvedValueOnce(
            [
                [adminUser],
                [],
            ] as never
        );

        const response =
            await request(app)
                .post("/api/auth/login")
                .send({
                    email: "admin@test.com",
                    password:
                        "incorrect-password",
                });

        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            success: false,
            message:
                "Invalid email or password",
        });
    });

    it("rejects an unknown email", async () => {
        mockedExecute.mockResolvedValueOnce(
            [
                [],
                [],
            ] as never
        );

        const response =
            await request(app)
                .post("/api/auth/login")
                .send({
                    email:
                        "unknown@test.com",
                    password: "123456",
                });

        expect(response.status).toBe(401);

        expect(response.body.message).toBe(
            "Invalid email or password"
        );
    });

    it("rejects missing credentials", async () => {
        const response =
            await request(app)
                .post("/api/auth/login")
                .send({});

        expect(response.status).toBe(400);

        expect(response.body).toEqual({
            success: false,
            message:
                "Email and password are required",
        });

        expect(
            mockedExecute
        ).not.toHaveBeenCalled();
    });
});

describe("Authentication middleware", () => {
    beforeEach(() => {
        mockedExecute.mockReset();
    });

    it("rejects a task request without a token", async () => {
        const response =
            await request(app).get(
                "/api/tasks"
            );

        expect(response.status).toBe(401);

        expect(response.body).toEqual({
            success: false,
            message:
                "Authentication token is required",
        });
    });

    it("rejects an invalid token", async () => {
        const response =
            await request(app)
                .get("/api/tasks")
                .set(
                    "Authorization",
                    "Bearer invalid-token"
                );

        expect(response.status).toBe(401);

        expect(response.body).toEqual({
            success: false,
            message:
                "Invalid or expired authentication token",
        });
    });
});

describe("Task API", () => {
    beforeEach(() => {
        mockedExecute.mockReset();
    });

    it("returns paginated tasks", async () => {
        const token = createToken();

        mockedExecute
            .mockResolvedValueOnce(
                [
                    [
                        {
                            total: 1,
                        },
                    ],
                    [],
                ] as never
            )
            .mockResolvedValueOnce(
                [
                    [
                        {
                            id: 1,
                            user_id: 1,
                            title: "Test Task",
                            description:
                                "Testing pagination",
                            priority: "High",
                            status: "Pending",
                            due_date:
                                "2026-07-23",
                            created_at:
                                new Date(),
                            updated_at:
                                new Date(),
                        },
                    ],
                    [],
                ] as never
            );

        const response =
            await request(app)
                .get(
                    "/api/tasks?page=1&limit=5"
                )
                .set(
                    "Authorization",
                    `Bearer ${token}`
                );

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(
            true
        );

        expect(
            Array.isArray(
                response.body.data
            )
        ).toBe(true);

        expect(response.body.data).toHaveLength(
            1
        );

        expect(
            response.body.pagination
        ).toEqual({
            page: 1,
            limit: 5,
            totalItems: 1,
            totalPages: 1,
        });
    });

    it("rejects an invalid page number", async () => {
        const response =
            await request(app)
                .get(
                    "/api/tasks?page=0&limit=5"
                )
                .set(
                    "Authorization",
                    `Bearer ${createToken()}`
                );

        expect(response.status).toBe(400);

        expect(response.body.message).toBe(
            "Page must be a positive integer"
        );
    });

    it("rejects a limit over 100", async () => {
        const response =
            await request(app)
                .get(
                    "/api/tasks?page=1&limit=101"
                )
                .set(
                    "Authorization",
                    `Bearer ${createToken()}`
                );

        expect(response.status).toBe(400);

        expect(response.body.message).toBe(
            "Limit must be between 1 and 100"
        );
    });

    it("rejects invalid task creation data", async () => {
        const response =
            await request(app)
                .post("/api/tasks")
                .set(
                    "Authorization",
                    `Bearer ${createToken()}`
                )
                .send({
                    title: "",
                    description: "",
                    priority: "",
                    status: "",
                    dueDate: "",
                });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(
            false
        );

        expect(response.body.message).toBe(
            "Validation failed"
        );

        expect(
            response.body.errors.title
        ).toBe("Title is required");

        expect(
            response.body.errors.priority
        ).toBe("Priority is required");

        expect(
            response.body.errors.status
        ).toBe("Status is required");

        expect(
            response.body.errors.dueDate
        ).toBe("Due date is required");
    });

    it("returns 404 for a missing task", async () => {
        mockedExecute.mockResolvedValueOnce(
            [
                [],
                [],
            ] as never
        );

        const response =
            await request(app)
                .get("/api/tasks/999")
                .set(
                    "Authorization",
                    `Bearer ${createToken()}`
                );

        expect(response.status).toBe(404);

        expect(response.body.message).toBe(
            "Task not found"
        );
    });
});

describe("Dashboard API", () => {
    beforeEach(() => {
        mockedExecute.mockReset();
    });

    it("returns dashboard statistics", async () => {
        mockedExecute.mockResolvedValueOnce(
            [
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
            ] as never
        );

        const response =
            await request(app)
                .get(
                    "/api/dashboard/summary"
                )
                .set(
                    "Authorization",
                    `Bearer ${createToken()}`
                );

        expect(response.status).toBe(200);

        expect(response.body).toEqual({
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

    it("protects the dashboard route", async () => {
        const response =
            await request(app).get(
                "/api/dashboard/summary"
            );

        expect(response.status).toBe(401);

        expect(response.body.message).toBe(
            "Authentication token is required"
        );
    });
});