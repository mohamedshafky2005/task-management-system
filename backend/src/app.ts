import express, {
    Application,
    Request,
    Response,
} from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";

dotenv.config();

const app: Application = express();

app.use(
    cors({
        origin:
            process.env.CLIENT_URL ||
            "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get(
    "/",
    (_request: Request, response: Response) => {
        response.status(200).json({
            success: true,
            message: "Task Management API is running",
        });
    }
);

app.get(
    "/api/health",
    (_request: Request, response: Response) => {
        response.status(200).json({
            success: true,
            message: "Server is healthy",
            timestamp: new Date().toISOString(),
        });
    }
);

app.use(
    (
        _request: Request,
        response: Response
    ): void => {
        response.status(404).json({
            success: false,
            message: "Route not found",
        });
    }
);

export default app;