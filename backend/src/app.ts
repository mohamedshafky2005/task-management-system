import express from "express";
import cors, { CorsOptions } from "cors";

import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "https://task-management-system-gamma-navy.vercel.app",
];

if (process.env.CLIENT_URL) {
    allowedOrigins.push(process.env.CLIENT_URL.replace(/\/$/, ""));
}

const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        // Allows Postman, Render health checks and server-to-server requests
        if (!origin) {
            callback(null, true);
            return;
        }

        const normalizedOrigin = origin.replace(/\/$/, "");

        if (allowedOrigins.includes(normalizedOrigin)) {
            callback(null, true);
            return;
        }

        console.error("Blocked CORS origin:", normalizedOrigin);

        // Reject without producing an Express 500 error
        callback(null, false);
    },

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Accept",
        "Origin",
    ],

    credentials: true,
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.options(/.*/, cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Task Management API is running",
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);

export default app;